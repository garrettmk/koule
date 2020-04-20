import { Machine, sendParent, assign } from "xstate";
import cuid from "cuid";

export const GraphQLSubscriptionMachine = Machine({
  id: 'graphql-subscription-machine',
  context: {
    id: undefined,
    query: undefined,
    variables: undefined
  },
  initial: 'initializing',
  states: {
    initializing: {
      entry: 'createId',
      on: {
        '': 'running',
      }
    },
    running: {
      entry: 'startSubscription',
      on: {
        WEBSOCKET_MESSAGE: [
          { cond: 'isResultMessage', actions: 'sendResultMessage' },
          { cond: 'isErrorMessage', actions: 'sendErrorMessage' }
        ]
      }
    }
  },
},{
  actions: {
    createId: assign({
      id: ({ id }) => id || cuid()
    }),

    startSubscription: sendParent(({ id, query, variables }) => ({
      type: 'WEBSOCKET_SEND',
      data: {
        id,
        type: 'start',
        payload: {
          variables,
          query: query.loc.source.body
        }
      }
    })),

    sendResultMessage: sendParent(({ onResult }, { message }) => {
      const { payload } = message;
      return {
        type: onResult,
        data: payload
      };
    }),

    sendErrorMessage: sendParent(({ onError }, { message }) => {
      const { payload } = message;
      return {
        type: onError,
        data: payload
      };
    })
  },

  guards: {
    isResultMessage: ({ id }, { message }) => {
      const { id: messageId, type } = message;
      return type === 'data' && messageId === id;
    },

    isErrorMessage: ({ id }, { message }) => {
      const { id: messageId, type } = message;
      return type === 'error' && messageId === id;
    }
  }
});