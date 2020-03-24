import { send, assign } from "xstate";

export default {
  context: {
    navigationHistory: []
  },

  states: {
    navigation: {
      initial: 'login',
      states: {
        login: {
          on: {
            SIGNED_IN: { actions: send('NAVIGATE_TASKS') },
            '*': undefined,
          }
        },
        groups: {
          entry: [
            'assignToNavHistory',
            send('LOAD_GROUPS'),
          ],
        },
        group: {
          entry: 'assignToNavHistory',
        },
        tasks: {
          entry: [
            'assignToNavHistory',
            send('LOAD_TASKS'),
          ]
        },
        task: {
          entry: [
            'assignToNavHistory',
            send((_, { id }) => ({ type: 'LOAD_TASK', id })),
          ],
        },
        chooseIcon: {
          entry: 'assignToNavHistory'
        },
        back: {
          entry: 'navigateBack',
          exit: 'popHistory'
        }
      },
      on: {
        SIGNED_OUT: '.login',
        NAVIGATE_GROUPS: '.groups',
        NAVIGATE_GROUP: [
          { cond: 'eventHasId', target: '.group', actions: 'sendLoadGroup' },
          { target: '.group', actions: 'sendCreateGroup' }
        ],
        NAVIGATE_TASKS: '.tasks',
        NAVIGATE_TASK: '.task',
        NAVIGATE_CHOOSE_ICON: '.chooseIcon',
        NAVIGATE_BACK: { cond: 'hasHistory', target: '.back' },
      }
    }
  },

  actions: {
    assignToNavHistory: assign({
      navigationHistory: (ctx, event) => ctx.navigationHistory.concat(event),
    }),

    popHistory: assign({
      navigationHistory: ({ navigationHistory }) => navigationHistory.slice(0, -2),
    }),

    navigateBack: send(({ navigationHistory }) => navigationHistory[navigationHistory.length - 2]),

    sendLoadGroup: send((_, { id }) => ({ type: 'LOAD_GROUP', id })),
    sendCreateGroup: send('CREATE_GROUP'),
  },

  guards: {
    hasHistory: ({ navigationHistory }) => navigationHistory.length > 1,
    eventHasId: (_, { id }) => id !== undefined,
  }
}