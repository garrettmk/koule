import cuid from 'cuid';
import { spawn, assign } from "xstate";
import { CREATE_TASK, SUBSCRIBE_CURRENT_TASK, SUBSCRIBE_TASK_BY_ID, UPDATE_TASK } from "../queries";

export default {
  context: {
    task: {
      data: {},
      error: null,
      subscription: null
    }
  },

  states: {
    task: {
      initial: 'invalid',
      states: {
        invalid: {
          on: {
            '': [
              { cond: 'isTaskFinished', target: 'finished' },
              { cond: 'isTaskRunning', target: 'running' },
              { cond: 'isTaskReady', target: 'ready' },
            ],
          }
        },
        ready: {
          on: {
            START_TASK: { target: 'saving', actions: 'startTask' },
          }
        },
        running: {
          on: {
            FINISH_TASK: { target: 'saving', actions: 'finishTask' },
          }
        },
        finished: {},
        loading: {
          entry: 'spawnSubscribeTask',
          on: {
            '': { cond: 'isTaskSubscribed', target: 'invalid' },
            SUBSCRIBE_TASK_RESULT: { target: 'invalid', actions: 'assignSubscribeTaskResult' },
            '*': undefined
          }
        },
        saving: {
          invoke: {
            id: 'save-task',
            src: 'saveTask',
            onDone: { target: 'invalid', actions: 'assignSaveTaskResult' },
            onError: { target: 'error', actions: 'assignSaveTaskError' },
          },
          on: {
            '*': undefined
          }
        },
        error: {}
      },
      on: {
        CREATE_TASK: { target: '.invalid', actions: 'createTask' },
        UPDATE_TASK: { target: '.invalid', actions: 'assignTaskUpdates' },
        SAVE_TASK: { cond: 'isTaskWithUpdatesValid', target: '.saving' },
        LOAD_TASK: '.loading',
        SUBSCRIBE_TASK_RESULT: { target: '.invalid', actions: 'assignSubscribeTaskResult' }
      }
    }
  },

  actions: {
    createTask: assign({
      task: ({ task }, { data = {} }) => {
        if (task.subscription)
          task.subscription.stop();

        return { data };
      }
    }),

    startTask: assign({
      task: ({ task }) => ({
        ...task,
        data: { ...task.data, start: new Date().toISOString() }
      })
    }),

    finishTask: assign({
      task: ({ task }) => ({
        ...task,
        data: { ...task.data, end: new Date().toISOString() }
      })
    }),

    assignTaskUpdates: assign({
      task: ({ task }, event ) => {
        const id = task.data.id || event.data.id;
        const { group, description } = { ...task.data, ...event.data };
        const { start, end } = task.data;

        const newData = { id, group, description, start, end };

        return { ...task, data: newData };
      }
    }),

    spawnSubscribeTask: assign({
      task: ({ task, apollo }, event) => {
        if (task.subscription)
          task.subscription.stop();

        const subscribeToId = event.id;// || task.data.id;

        const task$ = (subscribeToId
          ? apollo.subscribe({ query: SUBSCRIBE_TASK_BY_ID, variables: { id: subscribeToId } })
          : apollo.subscribe({ query: SUBSCRIBE_CURRENT_TASK }))
          .map(response => ({ type: 'SUBSCRIBE_TASK_RESULT', data: response }));

        return { ...task, subscription: spawn(task$) };
      }
    }),

    assignSubscribeTaskResult: assign({
      task: ({ task }, { data: result }) => {
        const data = result.data.tasks[0] || {};
        return { ...task, data, error: undefined };
      }
    }),

    assignSubscribeTaskError: assign({
      task: ({ task }, { data: error }) => ({
        ...task,
        error
      })
    }),

    assignSaveTaskResult: assign({
      task: ({ task }, { data: result }) => {
        const { update_tasks, insert_tasks } = result.data;
        const data = update_tasks ? update_tasks.returning[0] : insert_tasks.returning[0];

        return { ...task, data, error: null };
      }
    }),

    assignSaveTaskError: assign({
      task: ({ task }, { data: error }) => ({
        ...task,
        error
      })
    })
  },

  services: {
    saveTask: ({ task, apollo }, { data: eventData = {} }) => {
      const {
        description,
        start,
        end,
      } = { ...task.data, ...eventData };

      const group_id =
        eventData.group ? eventData.group.id :
        eventData.group_id ? eventData.group_id :
        task.data.group ? task.data.group.id :
        task.data.group_id;

      const dataIfUpdating = {
        id: task.data.id,
        group_id,
        description,
        start,
        end
      };

      const dataIfCreating = {
        id: eventData.id || cuid(),
        group_id,
        description,
        start,
        end
      };

      return task.data.id
        ? apollo.mutate({ mutation: UPDATE_TASK, variables: dataIfUpdating })
        : apollo.mutate({ mutation: CREATE_TASK, variables: dataIfCreating });
    }
  },

  guards: {
    isTaskFinished: ({ task }) => {
      const { id, description, start, end } = task.data;
      return id && description && start && end;
    },

    isTaskRunning: ({ task }) => {
      const { id, description, start } = task.data;
      return id && description && start;
    },

    isTaskReady: ({ task }) => {
      const { description } = task.data;
      return Boolean(description);
    },

    isTaskWithUpdatesValid: ({ task }, event) => {
      const { description } = { ...task.data, ...event.data };
      return Boolean(description);
    },

    isTaskSubscribed: ({ task }, event) => task.data.id === event.id && task.subscription,
  }
}