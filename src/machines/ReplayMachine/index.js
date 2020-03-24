import { Machine, assign, sendParent } from "xstate";

export const ReplayMachine = Machine({
  id: 'replay-machine',
  context: {
    history: [],
  },
  initial: 'running',
  states: {
    running: {
      on: {
        '*': [
          { cond: 'isReplayEvent', target: 'replay' },
          { cond: 'isMatchingEvent', actions: 'addToHistory'}
        ],
      }
    },
    replay: {
      entry: 'replayEvent',
      exit: 'popHistory',
      on: {
        '': 'running'
      }
    }
  }
},{
  actions: {
    addToHistory: assign({
      history: ({ history }, event) => [...history, event],
    }),

    popHistory: assign({
      history: ({ history }) => history.slice(0, -1),
    }),

    replayEvent: sendParent(({ history }) => history[history.length - 2])
  },

  guards: {
    isMatchingEvent: (_, { type }) => true,

    isReplayEvent: ({ history }, { type }) => history.length > 1 && type === 'NAVIGATE_BACK',
  }
});