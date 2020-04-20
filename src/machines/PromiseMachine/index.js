import { Machine, sendParent } from 'xstate';

export const PromiseMachine = Machine({
  id: 'promise-machine',
  context: {},
  initial: 'pending',
  states: {
    pending: {
      invoke: {
        src: 'promise',
        onDone: 'resolved',
        onError: 'rejected'
      }
    },

    resolved: {
      type: 'final',
      entry: sendParent((_, { data }) => ({
        type: 'RESOLVED',
        data
      }))
    },

    rejected: {
      type: 'final',
      entry: sendParent((_, { data }) => ({
        type: 'REJECTED',
        data
      }))
    }
  }
});