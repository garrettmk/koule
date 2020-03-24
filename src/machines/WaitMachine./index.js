import { Machine, assign, sendParent } from "xstate";
import { log } from "xstate/lib/actions";

export const WaitMachine = Machine({
  id: 'wait-machine',
  context: {
    events: [],
    timeout: null,
    onSuccess: 'WAIT_FINISHED',
    onTimeout: 'WAIT_TIMEOUT',
  },
  initial: 'ready',
  states: {
    ready: {
      on: {
        WAIT_FOR: {
          actions: ['assignWait'],
          target: 'waiting'
        }
      }
    },
    waiting: {
      on: {
        WAIT_CANCEL: {
          target: 'ready'
        },
        '*': [
          { cond: 'isFinalEvent', actions: ['clearContext', 'sendSuccessEvent'], target: 'ready' },
          { cond: 'isWaitEvent', actions: 'removeFromWait' }
        ]
      },
      invoke: {
        id: 'timer',
        src: 'timeoutService',
        onDone: {
          actions: ['clearWait', 'sendTimeoutEvent'],
          target: 'ready',
        }
      }
    },
  }
},{
  actions: {
    assignWait: assign((_, event) => ({
      events: event.events,
      timeout: event.timeout,
      onSuccess: event.onSuccess || 'WAIT_FINISHED',
      onTimeout: event.onTimeout || 'WAIT_TIMEOUT'
    })),

    removeFromWait: assign({
      events: ({ events }, { type }) => events.filter(
        event => event !== type
      )
    }),

    sendSuccessEvent: sendParent(({ onSuccess }) => onSuccess || ''),

    sendTimeoutEvent: sendParent(({ onTimeout }) => onTimeout || ''),

    clearContext: assign(() => ({})),
  },

  services: {
    timeoutService: ({ timeout }) => new Promise((resolve, reject) => {
      if (timeout)
        setTimeout(() => resolve(), timeout);
    })
  },

  guards: {
    isWaitEvent: ({ events }, { type }) => events.includes(type),

    isFinalEvent: ({ events }, { type }) => events.length === 1 && events[0] === type,
  }
});