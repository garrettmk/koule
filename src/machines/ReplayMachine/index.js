import { Machine, assign, sendParent } from "xstate";

export const ReplayMachine = Machine({
  id: 'replay-machine',
  context: {
    matcher: () => true,
    history: [],
  },
  initial: 'initializing',
  states: {
    initializing: {
      entry: 'createContext',
      on: {
        '': 'running',
      }
    },
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
    createContext: assign(context => ({
      matcher: context.matcher || (() => true),
      history: []
    })),

    addToHistory: assign({
      history: ({ history }, event) => [...(history || []), event],
    }),

    popHistory: assign({
      history: ({ history }) => history.slice(0, -1),
    }),

    replayEvent: sendParent(({ history }) => history[history.length - 2])
  },

  guards: {
    isMatchingEvent: ({ matcher }, event) => matcher(event),

    isReplayEvent: ({ history }, { type }) => history.length > 1 && type === 'NAVIGATE_BACK',
  }
});