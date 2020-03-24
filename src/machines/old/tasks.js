import { spawn, assign } from "xstate";
import { SUBSCRIBE_TASKS, SUBSCRIBE_TASKS_BY_DATE } from "../../queries";

export default {
  context: {
    tasks: {
      data: [],
      error: null,
      subscription: null
    }
  },

  states: {
    tasks: {
      initial: 'idle',
      states: {
        loading: {
          entry: 'spawnSubscribeTasks',
          on: {
            SUBSCRIBE_TASKS_RESULT: {
              target: 'idle',
              actions: 'assignSubscribeTasksResult'
            },
            '*': undefined,
          }
        },
        idle: {},
        error: {}
      },
      on: {
        LOAD_TASKS: { target: '.loading' },
        SUBSCRIBE_TASKS_RESULT: { target: '.idle', actions: 'assignSubscribeTasksResult' }
      }
    }
  },

  actions: {
    spawnSubscribeTasks: assign({
      tasks: ({ tasks, apollo }) => {
        if (tasks.subscription)
          tasks.subscription.stop();

        const variables = {
          after: new Date(0).toISOString(),
          before: null
        };

        const tasks$ = apollo
          .subscribe({ query: SUBSCRIBE_TASKS_BY_DATE, variables })
          .map(response => ({ type: 'SUBSCRIBE_TASKS_RESULT', response }));

        return { ...tasks, subscription: spawn(tasks$) };
      }
    }),

    assignSubscribeTasksResult: assign({
      tasks: ({ tasks }, { response }) => ({
        ...tasks,
        data: response.data.tasks || [],
        error: undefined
      })
    }),

    assignSubscribeTasksError: assign({
      tasks: ({ tasks }, { data: error }) => ({
        ...tasks,
        error
      })
    })
  }
}