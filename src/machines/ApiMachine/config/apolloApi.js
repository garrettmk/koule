import { assign, send, sendParent, spawn } from "xstate";
import { ApolloClient } from 'apollo-client';
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { getMainDefinition } from "apollo-utilities";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink, split } from "apollo-link";
import { setContext } from "apollo-link-context";
import { ApolloOperation } from "./ApolloOperation";
import MessageTypes from "subscriptions-transport-ws/dist/message-types";

let apollo = null;
let idToken = null;
let wsLink = null;

function createApolloClient(config) {
  const authLink = setContext(({ headers }) => ({
    headers: {
      ...headers,
      Authorization: 'Bearer ' + idToken,
    }
  }));

  const httpLink = new HttpLink({ uri: config.httpURI });

  wsLink = new WebSocketLink(
    new SubscriptionClient(config.websocketURI, {
      options: { reconnect: true },
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

  apollo = new ApolloClient({
    cache,
    link,
    defaultOptions: { fetchPolicy: 'network-only' }
  });
}

function restartWebsockets() {
  if (!wsLink)
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
}

export const apolloApi = config => ({
  actions: {
    initialize: () => {
      createApolloClient(config)
    },

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