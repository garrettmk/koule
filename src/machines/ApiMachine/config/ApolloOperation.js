import { Machine, sendParent } from "xstate";
import { getMainDefinition } from "apollo-utilities";

export const ApolloOperation = Machine({
  id: 'apollo-operation',
  context: {
    operation: null,
    event: null,
    send: null,
  },
  initial: 'pending',
  states: {
    pending: {
      invoke: {
        src: 'executeOperation',
        onDone: 'success',
        onError: 'error',
      },
      on: {
        SUBSCRIPTION_RESULT: {
          actions: 'sendSuccessEvent'
        }
      }
    },
    success: {
      type: 'final',
      entry: 'sendSuccessEvent',
    },
    error: {
      type: 'final',
      entry: 'sendErrorEvent'
    }
  }
},{
  actions: {
    sendSuccessEvent: sendParent(({ operation: { successEvent }}, { data }) => ({
      type: successEvent,
      data,
    })),

    sendErrorEvent: sendParent(({ operation, event }, { data }) => ({
      type: operation.errorEvent,
      event,
      data
    })),
  },

  services: {
    executeOperation: ({ operation, send }) => {
      const { body } = operation;
      const definition = getMainDefinition(body);

      if (definition.operation === 'subscription')
        return send().map(data => ({ type: 'SUBSCRIPTION_RESULT', data }));

      return send();
    }
  }
});