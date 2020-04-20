import { assign, send, sendParent, spawn } from "xstate";
import { ApolloClient } from 'apollo-client';
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { getMainDefinition } from "apollo-utilities";
import { InMemoryCache } from "apollo-cache-inmemory";
import { persistCache } from "apollo-cache-persist";
import { ApolloLink, split } from "apollo-link";
import { setContext } from "apollo-link-context";
import { ApolloOperation } from "./ApolloOperation";
import MessageTypes from "subscriptions-transport-ws/dist/message-types";
import localForage from 'localforage';

let apollo = null;
let idToken = null;
let wsLink = null;

localForage.config({
  driver: [localForage.INDEXEDDB, localForage.WEBSQL],
  name: 'koule-storage',
});

async function createApolloClient(config) {
  const authLink = setContext(({ headers }) => ({
    headers: {
      ...headers,
      Authorization: 'Bearer ' + idToken,
    }
  }));

  const httpLink = new HttpLink({ uri: config.httpURI });

  wsLink = new WebSocketLink(
    new SubscriptionClient(config.websocketURI, {
      options: {
        reconnect: true,
        lazy: true,
      },
      connectionParams: () => ({
        headers: {
          Authorization: 'Bearer ' + idToken
        }
      })
    })
  );

  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    ApolloLink.from([authLink, httpLink]),
  );

  const cache = new InMemoryCache();
  await persistCache({ cache, storage: localForage });

  apollo = new ApolloClient({
    cache,
    link,
    defaultOptions: { fetchPolicy: 'cache-first' }
  });
}

function restartWebsockets() {
  if (!wsLink || !self.navigator.onLine)  // eslint-disable-line no-restricted-globals
    return;

  const operations = { ...wsLink.subscriptionClient.operations };

  wsLink.subscriptionClient.close(true);
  wsLink.subscriptionClient.connect();

  Object.keys(operations).forEach(id => {
    wsLink.subscriptionClient.sendMessage(
      id,
      MessageTypes.GQL_START,
      operations[id].options,
    );
  });

  wsLink.subscriptionClient.operations = operations;
}

function websocketListener(callback, receive) {
  const removeDisconnectListener = wsLink.subscriptionClient.onDisconnected(data =>
    callback({ type: 'WEBSOCKETS_DISCONNECTED', data })
  );

  const removeErrorListener = wsLink.subscriptionClient.onError(data =>
    callback({ type: 'WEBSOCKETS_ERROR', data })
  );

  return () => {
    removeDisconnectListener();
    removeErrorListener();
  };
}

export const apolloApi = config => ({
  actions: {
    createOperationService: assign({
      services: ({ operations, services }, event) => {
        const op = operations.find(op => op.sendEvent === event.type);
        const { operation } = getMainDefinition(op.body);

        const send =
          operation === 'query' ? () => apollo.query({ query: op.body, variables: event.variables }) :
          operation === 'mutation' ? () => apollo.mutate({ mutation: op.body, variables: event.variables }) :
          operation === 'subscription' ? () => apollo.subscribe({ query: op.body, variables: event.variables }) :
          null;

        return [
          ...services,
          spawn(
            ApolloOperation.withContext({ operation: op, event, send }),
            { sync: true }
          )
        ];
      }
    }),

    restartRunningServices: assign({
      services: ({ services }) => {
        console.log('restarting services');
        debugger;
        const runningServices = services.filter(service => !service.state.done);

        return runningServices.map(service => {
          const { operation, event } = service.state.context;
          const { operation: opType } = getMainDefinition(operation.body);

          const send =
            opType === 'query' ? () => apollo.query({ query: operation.body, variables: event.variables }) :
            opType === 'mutation' ? () => apollo.mutate({ mutation: operation.body, variables: event.variables }) :
            opType === 'subscription' ? () => apollo.subscribe({ query: operation.body, variables: event.variables }) :
            null;

          return spawn(
            ApolloOperation.withContext({ operation, event, send }),
            { sync: true }
          );
        });
      },
    }),

    removeCompletedServices: assign({
      services: ({ services }) => services.filter(service => service.state.done),
    }),

    forwardToParent: sendParent((_, event) => event),

    registerApiOperations: assign({
      operations: ({ operations }, event) => operations.concat(event.operations),
    }),

    onAuthenticationEvent: sendParent((_, { value }) => {
      idToken = value;
      restartWebsockets();
      return 'API_READY';
    }),

    onAuthenticationError: sendParent('GET_ID_TOKEN'),

    reconnect: () => restartWebsockets(),
  },

  services: {
    initialize: () => createApolloClient(config),

    websocketListener: () => websocketListener,
  },

  guards: {
    isOperationEvent: ({ operations }, { type }) => Boolean(
      operations.find(op => op.sendEvent === type)
    ),

    isErrorEvent: ({ operations }, { type }) => Boolean(
      operations.find(op => op.errorEvent === type)
    ),

    isSuccessEvent: ({ operations }, { type }) => Boolean(
      operations.find(op => op.successEvent === type)
    ),

    isAuthenticationError: ({ operations }, { type, data = {} }) => {
      const op = operations.find(op => op.errorEvent === type);
      const { message = '' } = data;

      return op && message.includes('JWT');
    },

    isAuthenticationEvent: (_, { type }) => type === 'ID_TOKEN',
  }
});