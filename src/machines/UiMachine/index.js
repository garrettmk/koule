import { Machine, sendParent, send, assign } from "xstate";
import { log, raise } from "xstate/lib/actions";


export const UiMachine = Machine({
  id: 'ui-machine',
  context: {

  },
  initial: 'initializing',
  states: {
    initializing: {
      on: {
        SIGNED_IN: 'loading',
      }
    },
    loading: {
      entry: 'refreshUI',
      on: {
        SUBSCRIBE_TASK_LIST_RESULT: [
          { cond: 'isFullyLoaded', actions: 'navigateTaskList', target: 'taskList' },
          { actions: 'assignSubscriptionStatus' }
        ],
        SUBSCRIBE_GROUP_LIST_RESULT: [
          { cond: 'isFullyLoaded', actions: 'navigateTaskList', target: 'taskList' },
          { actions: 'assignSubscriptionStatus' }
        ]
      }
    },
    taskList: {
      entry: 'refreshUI',
      on: {
        SUBSCRIBE_TASK_LIST_RESULT: {
          actions: 'refreshUI'
        }
      }
    },
    taskView: {
      entry: 'refreshUI',
      on: {
        SUBSCRIBE_TASK_LIST_RESULT: {
          actions: 'refreshUI'
        },
        NAVIGATE_CHOOSE_ICON: {
          target: 'chooseGroupIcon'
        },
      }
    },
    chooseGroupIcon: {
      entry: 'refreshUI',
      on: {
        SUBSCRIBE_GROUP_LIST_RESULT: {
          actions: 'refreshUI'
        }
      }
    },
    groupList: {}
  },
  on: {
    NAVIGATE_TASK_LIST: {
      target: 'taskList',
    },
    NAVIGATE_TASK: {
      target: 'taskView',
    },
    NAVIGATE_CURRENT_TASK: {
      target: 'taskView',
    }
  }
},{
  actions: {
    refreshUI: sendParent('REFRESH_UI'),
    navigateTaskList: sendParent('NAVIGATE_TASK_LIST'),
    assignSubscriptionStatus: assign({
      subscriptionStatus: (_, { type }) => type,
    }),

    selectTask: sendParent((_, { id }) => ({
      type: 'SELECT_TASK',
      task: { id }
    }))
  },

  guards: {
    isFullyLoaded: ({ subscriptionStatus }, { type }) =>
      subscriptionStatus && subscriptionStatus !== type,
  }
});