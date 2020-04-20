import { Machine, sendParent } from 'xstate';

export const GraphQLQueryMachine = Machine({
  id: 'graphql-query-machine',
  context: {
    url: undefined,
    query: undefined,
    variables: undefined,
    onSuccess: undefined,
    onError: undefined,
  },
  initial: 'authorizing',
  states: {
    authorizing: {
      entry: 'getAuthorization',
      on: {
        API_AUTHORIZATION: 'pending'
      }
    },
    pending: {
      invoke: {
        src: 'query',
        onDone: 'success',
        onError: 'error'
      }
    },
    success: {
      entry: 'sendSuccess',
      on: {
        RETRY: 'authorizing'
      }
    },
    error: {
      entry: 'sendError',
      on: {
        RETRY: 'authorizing'
      }
    }
  }
},{
  actions: {
    getAuthorization: sendParent('GET_API_AUTHORIZATION'),

    sendSuccess: sendParent(({ onSuccess }, { data }) => ({
      type: onSuccess,
      data
    })),

    sendError: sendParent(({ onError }, { data }) => ({
      type: onError,
      data
    })),
  },

  services: {
    query: ({ url, query, variables }, { value: apiToken }) => fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiToken,
      },
      body: JSON.stringify({
        query: query.loc.source.body,
        variables
      })
    }).then(response => response.json())
  }
});