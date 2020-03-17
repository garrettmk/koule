import { Machine, spawn, assign, forwardTo, send, actions } from "xstate";
import { AuthMachine } from "./AuthMachine";
import { ApiMachine } from "./ApiMachine";
import { TasksMachine } from "./TasksMachine";
const { log } = actions;

export const AppMachine = Machine({
  id: 'app-machine',
  initial: 'initializing',
  context: {
    auth: null,
  },
  states: {
    initializing: {
      initial: 'auth',
      states: {
        auth: {
          entry: 'createAuthService',
          on: {
            SIGNED_IN: 'api'
          }
        },
        api: {
          entry: 'createApiService',
          on: {
            GET_ID_TOKEN: { actions: forwardTo('auth-service') },
            ID_TOKEN: { actions: forwardTo('api-service') },
            READY: { target: 'models' }
          }
        },
        models: {
          entry: 'createTasksService',
          on: {
            '': '#app-machine.ready'
          }
        }
      }
    },
    ready: {}
  },
  on: {
    GET_ID_TOKEN: {
      actions: forwardTo('auth-service')
    },
    QUERY: {
      // actions: forwardTo('api-service')
      actions: forwardTo(
        (context, event) => {
          debugger;
          return 'auth-service';
        }
      )
    },
    QUERY_TASKS_RESULT: {
      actions: forwardTo('tasks-service')
    }
  }
},{
  actions: {
    createAuthService: assign({
      auth: () => spawn(AuthMachine, 'auth-service')
    }),

    createApiService: assign({
      api: () => spawn(ApiMachine, 'api-service')
    }),

    createTasksService: assign({
      tasks: () => spawn(TasksMachine, 'tasks-service')
    })
  }
});