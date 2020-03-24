import { Machine, sendParent } from "xstate";
import { apollo } from "./ApolloMachine";

export const ApolloMutationMachine = Machine({
  id: 'apollo-mutation-machine',
  context: {
    mutation: null,
    successEvent: null,
    errorEvent: null,
    variables: {}
  },
  initial: 'pending',
  states: {
    pending: {
      invoke: {
        id: 'mutation-service',
        src: 'mutationService',
        onDone: 'success',
        onError: 'error',
      },
    },
    success: {
      entry: 'sendSuccessEvent',
      type: 'final',
    },
    error: {
      entry: 'sendErrorEvent',
      type: 'final',
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
      data
    })),
  },

  services: {
    mutationService: ({ mutation, variables }) => apollo.mutate({ mutation, variables }),
  },
});