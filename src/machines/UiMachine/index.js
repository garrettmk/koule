import { Machine, sendParent, send, assign } from "xstate";
import { log, raise } from "xstate/lib/actions";


export const UiMachine = Machine({
  id: 'ui-machine',
  context: {
    title: 'Koule',
    back: null
  },
  initial: 'initializing',
  states: {
    initializing: {
      entry: 'recordNavigation',
      on: {
        '': 'loading',
      }
    },
    loading: {
      entry: ['refreshUI', 'waitForInitialData'],
      on: {
        WAIT_FINISHED: {
          target: 'taskList',
          actions: 'navigateTaskList'
        },
      }
    },
    taskList: {
      entry: ['setTaskListHeader', 'refreshUI'],
      on: {
        SUBSCRIBE_TASK_LIST_RESULT: {
          actions: 'refreshUI'
        }
      }
    },
    taskView: {
      entry: ['setTaskViewHeader', 'refreshUI'],
      on: {
        FINISH_TASK: {
          actions: 'refreshUI'
        },
        UPDATE_TASK: {
          actions: 'refreshUI',
        },
        SUBSCRIBE_TASK_LIST_RESULT: {
          actions: 'refreshUI'
        },
        NAVIGATE_CHOOSE_ICON: {
          target: 'chooseGroupIcon'
        },
        NAVIGATE_BACK: {
          target: 'taskList'
        }
      }
    },
    chooseGroupIcon: {
      entry: ['setChooseIconHeader', 'refreshUI'],
      on: {
        SUBSCRIBE_GROUP_LIST_RESULT: {
          actions: 'refreshUI'
        },
        NAVIGATE_BACK: {
          target: 'taskView'
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
    },
  }
},{
  actions: {
    getToken: sendParent('GET_ID_TOKEN'),

    refreshUI: sendParent('REFRESH_UI'),

    navigateTaskList: sendParent('NAVIGATE_TASK_LIST'),

    waitForInitialData: sendParent({
      type: 'WAIT_FOR',
      events: ['SUBSCRIBE_TASK_LIST_RESULT', 'SUBSCRIBE_GROUP_LIST_RESULT'],
    }),

    recordNavigation: sendParent('RECORD_NAVIGATION'),

    setTaskListHeader: assign({
      title: 'Tasks',
      back: null
    }),

    setTaskViewHeader: assign({
      title: 'Edit Task',
      back: 'Task List'
    }),

    setChooseIconHeader: assign({
      title: 'Choose Activity Icon',
      back: 'Back to Task'
    })
  },
});