import { Machine, assign, sendParent } from "xstate";

export const NavigationMachine = Machine({
  id: 'navigation-machine',
  context: {
    history: []
  },
  initial: 'running',
  states: {
    running: {
      on: {
        '*': [
          { cond: 'isBackEvent', target: 'back' },
          { cond: 'isNavigationEvent', actions: 'addToHistory'}
        ],
      }
    },
    back: {
      entry: 'navigateBack',
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

    navigateBack: sendParent(({ history }) => history[history.length - 2])
  },

  guards: {
    isNavigationEvent: (_, { type }) => type.startsWith('NAVIGATE_'),

    isBackEvent: ({ history }, { type }) => history.length > 1 && type === 'NAVIGATE_BACK',
  }
});