import { Machine, sendParent } from "xstate";
import { log } from "xstate/lib/actions";

export const ApiMachine = Machine({
  id: 'api-machine',
  context: {
    operations: [],
    services: [],
  },
  initial: 'initializing',
  states: {
    initializing: {
      invoke: {
        src: 'initialize',
        onDone: 'running',
        onError: 'error'
      }
    },

    running: {
      invoke: {
        id: 'websocketListener',
        src: 'websocketListener'
      },
      on: {
        'xstate.update': {
          actions: 'removeCompletedServices'
        },

        WEBSOCKETS_DISCONNECTED: {
          actions: [
            sendParent((_, event) => event),
          ]
        },

        WEBSOCKETS_ERROR: {
          actions: sendParent((_, event) => event)
        },

        // NETWORK_ONLINE: {
        //   actions: 'restartRunningServices'
        // },

        '*': [
          { cond: 'isAuthenticationEvent', actions: 'onAuthenticationEvent' },
          { cond: 'isOperationEvent', actions: 'createOperationService' },
          { cond: 'isSuccessEvent', actions: 'forwardToParent' },
          { cond: 'isAuthenticationError', actions: ['forwardToParent', 'onAuthenticationError'] },
          { cond: 'isErrorEvent', actions: 'forwardToParent' }
        ]
      },
    },

    error: {}
  },
  on: {
    REGISTER_API_OPERATIONS: {
      actions: 'registerApiOperations',
    },
  }
});