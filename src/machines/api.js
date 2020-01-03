import { Machine, assign, sendParent, sendUpdate } from "xstate";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";

const DEFAULT_RESPONSE_MSG = 'UPDATE_DATA';

export const config = {
  id: 'api',
  context: {
    query: undefined,
    mutation: undefined,
    subscription: undefined,
    response: undefined,
    error: undefined,
    respondWith: 'UPDATE_DATA',
  },
  initial: 'idle',
  states: {
    idle: {},
    loading: {
      entry: 'clearPrevious',
      invoke: {
        id: 'fetch',
        src: 'fetch',
        onDone: 'success',
        onError: 'error',
      }
    },
    mutating: {
      invoke: {
        id: 'mutate',
        src: 'mutate',
        onDone: 'success',
        onError:  'error',
      }
    },
    success: {
      entry: ['assignResult', 'updateParent'],
    },
    error: {
      entry: 'assignError'
    },
  },
  on: {
    QUERY: 'loading',
    MUTATE: 'mutating',
    SUBSCRIBE: { actions: 'subscribe' },
    UNSUBSCRIBE: { actions: 'unsubscribe' },
    SUBSCRIPTION_UPDATE: { actions: ['assignSubscriptionUpdate', 'updateParent'] }
  }
};

let apollo;
export function initializeApi(token) {
  apollo = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: 'http://koule-api.herokuapp.com/v1/graphql',
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
  })
}

export const options = {
  actions: {
    clearPrevious: assign({
      response: undefined,
      error: undefined,
    }),

    assignResult: assign({
      response: (_, event) => event.data.data,
      error: undefined,
    }),

    assignError: assign({
      error: (_, event) => event.data,
      response: undefined
    }),

    updateParent: sendParent(
      ({ respondWith }, { data: { data } }) => ({ type: respondWith || DEFAULT_RESPONSE_MSG, data })
    ),

    subscribe: assign({
      subscription$: (context, event) => apollo.subscribe({
        query: event.subscription || event.query || context.subscription || context.query,
        variables: event.variables,
      }).subscribe({
        next: ({ data }) => ({ type: 'SUBSCRIPTION_UPDATE', data }),
        complete: ({ type: 'UNSUBSCRIBE' })
      })
    }),

    // TODO: this is probably wrong
    unsubscribe: assign({
      subscription$: ({ subscription$ }) => { subscription$.unsubscribe(); }
    }),

    assignSubscriptionUpdate: assign({
      response: (_, { data }) => data,
    })
  },
  services: {
    fetch: ({ query: contextQuery }, { query: eventQuery, variables }) => apollo.query({
      query: eventQuery || contextQuery,
      variables,
      fetchPolicy: 'network-only'
    }),

    mutate: ({ mutation: contextMutation }, { mutation: eventMutation, variables }) => apollo.mutate({
      mutation: eventMutation || contextMutation,
      variables,
    })
  }
};

export const ApiMachine = Machine(config, options);