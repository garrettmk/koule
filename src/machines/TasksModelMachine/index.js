import { assign, Machine, sendParent } from 'xstate';
import { SUBSCRIBE_TASKS, UPSERT_TASK } from "./queries";
import cuid from 'cuid';

export const TasksModelMachine = Machine({
  id: 'tasks-model-machine',
  context: {
    tasks: []
  },
  initial: 'initializing',
  states: {
    initializing: {
      entry: 'registerApiOperations',
      on: {
        '': 'ready'
      }
    },
    ready: {
      entry: 'subscribeTasks'
    }
  },
  on: {
    API_READY: {
      actions: 'subscribeTasks'
    },

    SUBSCRIBE_TASK_LIST_RESULT: {
      actions: 'assignSubscribeResult',
    },

    UPDATE_TASK: {
      actions: 'assignUpdateOptimistic'
    },

    UPDATE_TASK_RESULT: {
      actions: 'assignUpdateResult'
    },

    NAVIGATE_TASK: {
      actions: 'selectNavigatedTask'
    },

    CREATE_TASK: {
      actions: ['assignNewTask', 'createNewTask', 'selectLastTask', 'navigateLastTask']
    }
  }
},{
  actions: {
    registerApiOperations: sendParent({
      type: 'REGISTER_API_OPERATIONS',
      operations: {
        SUBSCRIBE_TASK_LIST: {
          body: SUBSCRIBE_TASKS,
          successEvent: 'SUBSCRIBE_TASK_LIST_RESULT',
          errorEvent: 'SUBSCRIBE_TASK_LIST_ERROR',
        },
        UPDATE_TASK: {
          body: UPSERT_TASK,
          successEvent: 'UPDATE_TASK_RESULT',
          errorEvent: 'UPDATE_TASK_ERROR',
          excludeFromCache: true,
        }
      }
    }),

    subscribeTasks: sendParent('SUBSCRIBE_TASK_LIST'),

    assignSubscribeResult: assign({
      tasks: (_, event) => event.data.data.tasks.map(task => ({
        id: task.id,
        group_id: task.group_id,
        start: task.start,
        end: task.end,
        description: task.description
      })),
    }),

    assignUpdateResult: assign({
      tasks: ({ tasks }, event) => {
        const updatedTask = event.data.data.insert_tasks.returning[0];
        delete updatedTask.__typename;

        return tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
      }
    }),

    assignUpdateOptimistic: assign({
      tasks: ({ tasks }, event) => {
        const updatedTask = event.variables;
        return tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
      }
    }),

    selectNavigatedTask: sendParent(({ tasks }, event) => ({
      type: 'SELECT_TASK',
      task: tasks.find(task => task.id === event.id) || {}
    })),

    assignNewTask: assign({
      tasks: ({ tasks }) => [
        ...tasks,
        {
          id: cuid(),
          group_id: tasks.length ? tasks[tasks.length - 1].group_id : null
        }
      ]
    }),

    createNewTask: sendParent(({ tasks }) => ({
      type: 'UPDATE_TASK',
      variables: tasks[tasks.length - 1]
    })),

    selectLastTask: sendParent(({ tasks }) => ({
      type: 'SELECT_TASK',
      task: tasks[tasks.length - 1]
    })),

    navigateLastTask: sendParent(({ tasks }) => ({
      type: 'NAVIGATE_TASK',
      id: tasks[tasks.length - 1].id
    }))
  }
});