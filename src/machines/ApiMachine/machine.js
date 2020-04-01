import { Machine } from "xstate";

export const ApiMachine = Machine({
  id: 'api-machine',
  context: {
    operations: [],
    services: [],
  },
  initial: 'initializing',
  states: {
    initializing: {
      entry: 'initialize',
      on: {
        '': 'running',
      }
    },

    running: {
      on: {
        '*': [
          { cond: 'isAuthenticationEvent', actions: 'onAuthenticationEvent' },
          { cond: 'isOperationEvent', actions: 'createOperationService' },
          { cond: 'isSuccessEvent', actions: 'forwardToParent' },
          { cond: 'isAuthenticationError', actions: ['forwardToParent', 'onAuthenticationError'] },
          { cond: 'isErrorEvent', actions: 'forwardToParent' }
        ]
      },
    },
  },
  on: {
    'xstate.update': {
      actions: 'removeCompletedServices'
    },

    REGISTER_API_OPERATIONS: {
      actions: 'registerApiOperations',
    },
  }
});