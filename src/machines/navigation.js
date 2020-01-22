import { send } from "xstate";

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
            SIGNED_IN: 'tasks',
            '*': undefined,
          }
        },
        groups: {
          entry: send('LOAD_GROUPS'),
        },
        tasks: {
          entry: send('LOAD_TASKS')
        },
        currentTask: {
          entry: send('LOAD_TASK')
        },
      },
      on: {
        SIGNED_OUT: '.login',
        NAVIGATE_GROUPS: '.groups',
        NAVIGATE_TASKS: '.tasks',
        NAVIGATE_CURRENT: '.currentTask',
      }
    }
  },

  actions: {

  },

  guards: {

  }
}