import { Machine, sendParent } from "xstate";
import { apollo } from "./ApolloMachine";

export const ApolloQueryMachine = Machine({
  id: 'apollo-query-machine',
  context: {
    query: null,
    successEvent: null,
    errorEvent: null,
    variables: {},
  },
  initial: 'pending',
  states: {
    pending: {
      invoke: {
        id: 'query-service',
        src: 'queryService',
        onDone: 'success',
        onError: 'error',
      },
    },
    success: {
      entry: 'sendSuccessEvent',
      type: 'final'
    },
    error: {
      entry: 'sendErrorEvent',
      type: 'final'
    }
  },
},{
  actions: {
    sendSuccessEvent: sendParent(({ successEvent }, { data }) => ({
      type: successEvent,
      data
    })),

    sendErrorEvent: sendParent(({ errorEvent }, { data }) => ({
      type: errorEvent,
      data,
    }))
  },

  services: {
    queryService: ({ query, variables }) => apollo.query({
      query,
      variables
    }),
  },
});