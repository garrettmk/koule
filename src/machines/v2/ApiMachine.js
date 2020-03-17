import { Machine, actions } from "xstate";
import { assign, sendParent, spawn } from "xstate";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { getMainDefinition } from "apollo-utilities";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { split } from 'apollo-link';
import { snakeCase } from 'lodash';
import { QUERY_TASKS_BY_DATE } from "../../queries";
const { log } = actions;

export const ApiMachine = Machine({
  id: 'api-machine',
  initial: 'initializing',
  context: {
    apollo: undefined,
    refs: {},
  },
  states: {
    initializing: {
      entry: 'getToken',
      on: {
        ID_TOKEN: {
          actions: 'createApollo',
          target: 'ready'
        }
      }
    },
    ready: {
      entry: sendParent('READY'),
      on: {
        QUERY_TASKS: { actions: 'spawnQueryTasks' },
        'done.invoke.queryTasks': { actions: ['sendQueryTasksResponse', 'deleteQueryTasksRef'] },

        QUERY_GROUPS: { actions: 'spawnQueryGroups' },
        'done.invoke.queryGroups': { actions: ['sendQueryGroupsResponse', 'deleteQueryGroupsRef'] },
      }
    }
  },
},{
  actions: {
    getToken: sendParent('GET_ID_TOKEN'),

    createApollo: assign({
      apollo: (_, { value: idToken }) => {
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

        return new ApolloClient({
          cache: new InMemoryCache(),
          link,
          defaultOptions: { fetchPolicy: 'network-only' }
        })
      }
    }),

    spawnQueryTasks: assign({
      refs: ({ apollo, refs }, { variables }) => ({
        ...refs,
        queryTasks: spawn(apollo.query({
          query: QUERY_TASKS_BY_DATE,
          variables
        }), 'queryTasks')
      })
    }),

    sendQueryTasksResponse: sendParent((_, event) => ({
      type: 'QUERY_TASKS_RESPONSE',
      data: event.data,
    })),

    deleteQueryTasksRef: assign({
      refs: ({ refs }) => ({
        ...refs,
        queryTasks: undefined,
      })
    }),


  },

  guards: {
    isDoneMessage: (_, event) => event.type.startsWith('done.invoke'),

    isErrorMessage: (_, event) => event.type.startsWith('error.invoke'),
  }
});