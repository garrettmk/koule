import { Machine, sendParent, assign, spawn, forwardTo } from "xstate";
import { ApolloQueryMachine } from "./ApolloQueryMachine";
import { ApolloMutationMachine } from "./ApolloMutationMachine";
import { ApolloSubscriptionMachine } from "./ApolloSubscriptionMachine";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";

import QueueLink from 'apollo-link-queue';
import { RetryLink } from "apollo-link-retry";
import SerializingLink from 'apollo-link-serialize';
import { SubscriptionClient } from "subscriptions-transport-ws";
import { getMainDefinition } from "apollo-utilities";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { CachePersistor } from "apollo-cache-persist";
import { split } from 'apollo-link';
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";

export let apollo = null;
let idToken = null;


export const ApolloMachine = Machine({
  id: 'api-service',
  context: {
    operations: [],
    services: []
  },
  initial: 'initializing',
  states: {
    initializing: {
      on: {
        SIGNED_IN: { actions: 'getToken' },
        ID_TOKEN: {
          actions: ['initialize', sendParent('API_READY')],
          target: 'ready'
        },
        '*': null
      }
    },
    ready: {},
    pending: {},
  },
  on: {
    REGISTER_API_OPERATIONS: {
      actions: 'registerOperations',
    },
    ID_TOKEN: {
      actions: 'setIdToken'
    },
    '*': [
      { cond: 'shouldCreateService', actions: 'createService', target: 'pending' },
      { cond: 'isExpiredTokenError', actions: ['forwardToParent', 'removeCompletedServices', 'getToken'], target: 'pending' },
      { cond: 'shouldForwardToParent', actions: ['forwardToParent', 'removeCompletedServices'], target: 'ready' }
    ],
  },
},{
  actions: {
    getToken: sendParent('GET_ID_TOKEN'),

    setIdToken: (_, { value }) => idToken = value,

    initialize: (_, { value }) => {
      idToken = value;

      const authLink = setContext(({ headers}) => ({
        headers: {
          ...headers,
          Authorization: 'Bearer ' + idToken
        }
      }));

      const httpLink = new HttpLink({
        uri: 'http://koule-api.herokuapp.com/v1/graphql',
        headers: { Authorization: 'Bearer ' + idToken },
      });

      const wsLink = new WebSocketLink(
        new SubscriptionClient('ws://koule-api.herokuapp.com/v1/graphql', {
          options: { reconnect: true },
          connectionParams: {
            headers: {
              Authorization: 'Bearer ' + idToken
            }
          }
        }));

      const link = split(
        ({ query }) => {
          const { kind, operation } = getMainDefinition(query);
          return kind === 'OperationDefinition' && operation === 'subscription';
        },
        wsLink,
        ApolloLink.from([authLink, httpLink])
      );

      const cache = new InMemoryCache();

      apollo = new ApolloClient({
        cache,
        link,
        defaultOptions: { fetchPolicy: 'cache-and-network' }
      });
    },

    createService: assign({
      services: ({ operations = [], services = [] }, event) => {
        const op = operations.find(op =>
          [op.queryEvent, op.mutateEvent, op.subscribeEvent].includes(event.type)
        );

        const opMachine =
          op.queryEvent ? ApolloQueryMachine :
            op.mutateEvent ? ApolloMutationMachine :
              op.subscribeEvent ? ApolloSubscriptionMachine :
                null;

        return [
          ...services,
          spawn(
            opMachine.withContext({ ...op, variables: event.variables }),
            { sync: true }
          )
        ];
      }
    }),

    forwardToParent: sendParent((_, event) => event),

    removeCompletedServices: assign({
      services: ({ services }) => services.filter(service => !service.state.done)
    }),

    registerOperations: assign({
      operations: ({ operations }, { operations: newOperations }) => [...operations, ...newOperations]
    }),
  },

  guards: {
    shouldCreateService: ({ operations }, event) => operations.some(op => {
      const { queryEvent, mutateEvent, subscribeEvent } = op;
      return [queryEvent, mutateEvent, subscribeEvent].includes(event.type);
    }),

    shouldForwardToParent: ({ operations = [], services = [] }, event, meta) => {
      const isSuccessOrErrorMessage = operations.some(op =>
        [op.successEvent, op.errorEvent].includes(event.type)
      );

      const isFromChild = services.some(service =>
        meta._event.origin === service.sessionId
      );

      return isSuccessOrErrorMessage && isFromChild;
    },

    isExpiredTokenError: (_, { data = {} }) => {
      const { message = '' } = data;
      return message.includes('JWTExpired');
    },

    isMutationError: ({ services }, event, meta) => {
      const { origin } = meta._event;
      const originService = services.find(service => service.sessionId === origin);
      return originService && originService.machine.id === 'apollo-mutation-machine';
    }
  }
});