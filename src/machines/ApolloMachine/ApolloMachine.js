import { Machine, sendParent, assign, spawn, forwardTo } from "xstate";
import { ApolloQueryMachine } from "./ApolloQueryMachine";
import { ApolloMutationMachine } from "./ApolloMutationMachine";
import { ApolloSubscriptionMachine } from "./ApolloSubscriptionMachine";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { getMainDefinition } from "apollo-utilities";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { split } from 'apollo-link';

export let apollo = null;

export const ApolloMachine = Machine({
  id: 'api-service',
  context: {
    operations: [],
    services: []
  },
  initial: 'initializing',
  states: {
    initializing: {
      // entry: 'getToken',
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
    '*': [
      { cond: 'shouldCreateService', actions: 'createService', target: 'pending' },
      { cond: 'isExpiredTokenError', actions: ['forwardToParent', 'removeCompletedServices', 'getToken'], target: 'pending' },
      { cond: 'shouldForwardToParent', actions: ['forwardToParent', 'removeCompletedServices'], target: 'ready' }
    ],
  },
},{
  actions: {
    getToken: sendParent('GET_ID_TOKEN'),

    initialize: (_, { value: idToken }) => {
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
        httpLink
      );

      apollo = new ApolloClient({
        cache: new InMemoryCache(),
        link,
        defaultOptions: { fetchPolicy: 'network-only' }
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

    isExpiredTokenError: (_, { data }) => {
      const message = data && data.message || '';
      message.includes('JWTExpired')
    },
  }
});