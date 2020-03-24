import { Machine, assign, sendParent, send } from "xstate";
import { SUBSCRIBE_TASKS_BY_DATE } from "./queries";
import cuid from "cuid";

export const TaskListMachine = Machine({
  id: 'task-list-machine',
  context: {
    taskList: []
  },
  initial: 'ready',
  states: {
    initializing: {
      on: {
        SUBSCRIBE_TASK_LIST_RESULT: {
          actions: 'assignSubscribeResult',
          target: 'ready'
        }
      }
    },
    ready: {
      on: {
        NAVIGATE_TASK: {
          actions: 'selectTask'
        },
        NAVIGATE_CURRENT_TASK: [
          { cond: 'noCurrentTask', actions: ['assignNewTask', 'sendCreateTask', 'selectLastTask'] },
          { actions: 'selectLastTask' }
        ]
      }
    }
  },
  on: {
    API_READY: {
      actions: ['registerApiOperations', 'subscribeTaskList'],
    },

    SELECT_DATE_RANGE: {
      actions: ['unsubscribeTaskLast', 'internalSelectDateRange'],
    },
    INTERNAL_SELECT_DATE_RANGE: {
      actions: 'subscribeTaskList',
    },

    SUBSCRIBE_TASK_LIST_RESULT: {
      actions: 'assignSubscribeResult'
    }
  }
},{
  actions: {
    registerApiOperations: sendParent({
      type: 'REGISTER_API_OPERATIONS',
      operations: [
        {
          subscription: SUBSCRIBE_TASKS_BY_DATE,
          subscribeEvent: 'SUBSCRIBE_TASK_LIST',
          successEvent: 'SUBSCRIBE_TASK_LIST_RESULT',
          errorEvent: 'SUBSCRIBE_TASK_LIST_ERROR',
          cancelEvent: 'SUBSCRIBE_TASK_LIST_CANCEL'
        }
      ]
    }),

    subscribeTaskList: sendParent((_, { after, before }) => ({
      type: 'SUBSCRIBE_TASK_LIST',
      variables: {
        after: after || new Date().toISOString(),
        before,
      }
    })),

    unsubscribeTaskList: sendParent({
      type: 'SUBSCRIBE_TASK_LIST_CANCEL'
    }),

    internalSelectDateRange: send((_, { before, after }) => ({
      type: 'INTERNAL_SELECT_DATE_RANGE',
      before,
      after
    })),

    assignSubscribeResult: assign({
      taskList: (_, { data }) => data.data.tasks || []
    }),

    selectTask: sendParent(({ taskList }, { id }) => ({
      type: 'SELECT_TASK',
      task: taskList.find(task => task.id === id)
    })),

    assignNewTask: assign({
      taskList: ({ taskList }) => {
        const lastTask = taskList[taskList.length - 1] || {};

        return [
          ...taskList,
          {
            id: cuid(),
            group_id: lastTask.group_id
          }
        ]
      }
    }),

    sendCreateTask: sendParent(({ taskList }) => ({
      type: 'CREATE_TASK',
      variables: taskList[taskList.length - 1]
    })),

    selectLastTask: sendParent(({ taskList }) => ({
      type: 'SELECT_TASK',
      task: taskList[taskList.length - 1]
    }))
  },

  guards: {
    noCurrentTask: ({ taskList }) =>
      !taskList.length ||
      !!taskList[taskList.length - 1].end,
  }
});