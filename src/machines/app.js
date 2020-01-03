import { Machine, assign, spawn, send, forwardTo, actions } from "xstate";
import { AuthenticationMachine } from "./authentication";
import { ApiMachine, initializeApi } from "./api";
import { TaskMachine } from "./task";
import { GET_TASKS, GET_GROUPS, GET_TASK_COUNT_BY_DATE, GET_CURRENT_TASK, GET_TASK_BY_ID } from "../queries";
import { uniq } from 'lodash';

const { respond } = actions;



export const config = {
  id: 'app',
  context: {
    auth: null,
    api: null,
  },
  initial: 'login',
  states: {
    login: {
      entry: 'createAuthService',
      on: {
        SIGN_IN: { actions: forwardTo('auth') },
        SIGNED_IN: { target: 'home', actions: ['createApiServices', 'createTaskService', 'getGroups'] },
        NAVIGATE_HOME: undefined,
        NAVIGATE_CALENDAR: undefined,
        NAVIGATE_DAY: undefined,
        NAVIGATE_TASK: undefined,
      }
    },
    home: {},
    calendar: {
      entry: 'getTaskCountByDate'
    },
    day: {
      entry: 'getTasksForDate',
    },
    task: {
      entry: 'updateTaskService',
    },
  },
  on: {
    SIGN_OUT: { actions: forwardTo('auth') },
    SIGNED_OUT: 'login',
    NAVIGATE_HOME: 'home',
    NAVIGATE_CALENDAR: 'calendar',
    NAVIGATE_DAY: 'day',
    NAVIGATE_TASK: 'task',
    NAVIGATE_CURRENT: 'task',
  }
};

export const options = {
  actions: {
    createAuthService: assign({
      auth: ctx => ctx.auth || spawn(AuthenticationMachine, 'auth')
    }),

    createApiServices: assign((ctx, event) => {
      const {idToken} = event.data;
      initializeApi(idToken);

      return {
        ...ctx,
        api: {
          getTasks: spawn(ApiMachine.withContext({query: GET_TASKS, respondWith: 'UPDATE_TASKS'}), 'api.getTasks'),
          getGroups: spawn(ApiMachine.withContext({query: GET_GROUPS}), 'api.getGroups'),
          getTaskCountByDate: spawn(ApiMachine.withContext({query: GET_TASK_COUNT_BY_DATE}), 'api.getTaskCountByDate'),
        }
      }
    }),

    createTaskService: assign({
      task: (_, { id }) => spawn(TaskMachine.withContext({ task: { id } }), 'task-service'),
    }),

    getGroups: send('QUERY', {to: 'api.getGroups'}),

    getTaskCountByDate: send('QUERY', {to: 'api.getTaskCountByDate'}),

    getTasksForDate: send(
      (_, {date}) => ({type: 'QUERY', variables: timestampRangeFromDate(date)}),
      {to: 'api.getTasks'}
    ),

    updateTaskService: send(
      (_, { id }) => ({ type: 'GET_TASK', id }),
      { to: 'task-service' }
    ),

  },
  services: {},
  guards: {},
};

function timestampRangeFromDate(date) {
  return {
    after: new Date(date),
    before: new Date(new Date(date).getTime() + 1000 * 60 * 60 * 24 - 1)
  };
}

export const eventCreators = {
  signIn: 'SIGN_IN',
  signOut: 'SIGN_OUT',
  navigateHome: 'NAVIGATE_HOME',
  navigateCalendar: 'NAVIGATE_CALENDAR',
  navigateDay: 'NAVIGATE_DAY',
  navigateTask: 'NAVIGATE_TASK',
};


export const AppMachine = Machine(config, options);