import { Machine, assign, send } from 'xstate';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import {
  CREATE_GROUP,
  GET_CURRENT_TASK,
  GET_GROUP_BY_ID, GET_GROUPS, GET_TASK_COUNT_BY_DATE, GET_TASKS_BY_DATE,
  UPDATE_GROUP
} from "../queries";
import auth0 from 'auth0-js';
import authConfig from '../config/auth';
import { GET_TASK_BY_ID, UPDATE_TASK, CREATE_TASK } from "../queries";
import cuid from 'cuid';

let webAuth = new auth0.WebAuth(authConfig);
let apolloClient = null;

export default Machine({
  id: 'app-machine',
  context: {
    auth: null,
    task: {
      data: {},
      error: null,
    },
    group: {
      data: {},
      error: null
    },
    calendar: {
      data: [],
      error: null
    },
    day: {
      data: [],
      error: null
    },
    groupList: {
      data: [],
      error: null
    },
    navigationHistory: [],
  },
  type: 'parallel',
  states: {
    auth: {
      initial: 'signedOut',
      states: {
        signedOut: {
          on: {
            '': { cond: 'isCallbackUrl', target: 'authenticating' },
            SIGN_IN: 'authenticating',
          }
        },
        authenticating: {
          invoke: {
            id: 'login-service',
            src: 'login',
            onDone: [
              { cond: 'isLoginPending' },
              { target: 'signedIn', actions: 'assignAuthResult' },
            ],
            onError: 'signedOut',
          }
        },
        signedIn: {
          entry: [
            'initializeApi',
            send('SIGNED_IN'),
            send('LOAD_CALENDAR'),
            send('LOAD_DAY'),
            send('LOAD_TASK'),
            send('LOAD_GROUP_LIST'),
          ],
          on: {
            SIGN_OUT: { target: 'signedOut', actions: 'signOut' }
          }
        }
      }
    },
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
            SAVE_TASK: undefined,
          }
        },
        ready: {
          on: {
            START_TASK: { target: 'saving', actions: 'startTask' },
          }
        },
        running: {
          on: {
            FINISH_TASK: { target: 'saving', actions: 'finishTask' }
          }
        },
        finished: {},
        loading: {
          invoke: {
            id: 'load-task',
            src: 'loadTask',
            onDone: { target: 'invalid', actions: 'assignLoadTaskResult' },
            onError: { target: 'error', actions: 'assignLoadTaskError' }
          },
          on: {
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
        CREATE_NEW_TASK: { target: '.invalid', actions: 'createTask' },
        UPDATE_TASK: { target: '.invalid', actions: 'assignTaskUpdates' },
        SAVE_TASK: '.saving',
        LOAD_TASK: '.loading',
      }
    },
    group: {
      initial: 'invalid',
      states: {
        invalid: {
          on: {
            '': [
              { cond: 'isGroupValid', target: 'valid' }
            ],
            SAVE_GROUP: undefined
          }
        },
        valid: {},
        loading: {
          invoke: {
            id: 'load-group',
            src: 'loadGroup',
            onDone: { target: 'invalid', actions: 'assignLoadGroupResult' },
            onError: { target: 'error', actions: 'assignLoadGroupError' }
          },
          on: {
            '*': undefined
          }
        },
        saving: {
          invoke: {
            id: 'save-group',
            src: 'saveGroup',
            onDone: { target: 'invalid', actions: 'assignSaveGroupResult' },
            onError: { target: 'error', actions: 'assignSaveGroupError' }
          },
          on: {
            '*': undefined
          }
        },
        error: {}
      },
      on: {
        CREATE_GROUP: { target: '.invalid', actions: 'createGroup' },
        UPDATE_GROUP: { target: '.invalid', actions: 'assignGroupUpdates' },
        SAVE_GROUP: '.saving',
        LOAD_GROUP: '.loading'
      }
    },
    calendar: {
      initial: 'idle',
      states: {
        loading: {
          invoke: {
            id: 'load-calendar',
            src: 'loadCalendar',
            onDone: { target: 'idle', actions: 'assignLoadCalendarResult' },
            onError: { target: 'error', actions: 'assignLoadCalendarError' }
          }
        },
        idle: {},
        error: {},
      },
      on: {
        LOAD_CALENDAR: '.loading'
      }
    },
    day: {
      initial: 'idle',
      states: {
        loading: {
          invoke: {
            id: 'load-day',
            src: 'loadDay',
            onDone: { target: 'idle', actions: 'assignLoadDayResult' },
            onError: { target: 'error', actions: 'assignLoadDayError' },
          }
        },
        idle: {},
        error: {}
      },
      on: {
        LOAD_DAY: '.loading'
      }
    },
    groupList: {
      initial: 'idle',
      states: {
        loading: {
          invoke: {
            id: 'load-groups',
            src: 'loadGroups',
            onDone: { target: 'idle', actions: 'assignLoadGroupListResult' },
            onError: { target: 'error', actions: 'assignLoadGroupListError' }
          }
        },
        idle: {},
        error: {}
      },
      on: {
        LOAD_GROUP_LIST: '.loading'
      }
    },
    navigation: {
      initial: 'login',
      states: {
        login: {
          on: {
            SIGNED_IN: 'home',
            '*': undefined,
          }
        },
        home: {},
        calendar: {},
        day: {},
        task: {},
        group: {},
        back: {
          entry: 'navigateBack',
          exit: 'popFromNavHistory',
        }
      },
      on: {
        NAVIGATE_HOME: { target: '.home', actions: 'addToNavHistory' },
        NAVIGATE_CALENDAR: { target: ['.calendar', 'calendar.loading'], actions: 'addToNavHistory' },
        NAVIGATE_DAY: { target: ['.day', 'day.loading'], actions: 'addToNavHistory' },
        NAVIGATE_TASK: { target: ['.task', 'task.loading'], actions: 'addToNavHistory' },
        NAVIGATE_GROUP: { target: '.group', actions: 'addToNavHistory' },
        NAVIGATE_BACK: { cond: 'hasNavHistory', target: '.back' },
      }
    },
  },
}, {
  actions: {
    assignAuthResult: assign({
      auth: (_, { data }) => data,
    }),

    initializeApi: ({ auth }) => {
      apolloClient = new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
          uri: 'http://koule-api.herokuapp.com/v1/graphql',
          headers: {
            Authorization: 'Bearer ' + auth.idToken,
          }
        })
      })
    },

    signOut: assign(context => {
      webAuth.logout();

      return {
        ...context,
        auth: null
      }
    }),

    createTask: assign({
      task: () => ({ data: {}, error: null })
    }),

    startTask: assign({
      task: ({ task: { data } }) => ({ data: { ...data, start: new Date().toISOString() }, error: null }),
    }),

    finishTask: assign({
      task: ({ task: { data } }) => ({ data: { ...data, end: new Date().toISOString() }, error: null })
    }),

    assignTaskUpdates: assign({
      task: ({ task: { data } }, { task: { group_id, description }  }) => ({
        data: { ...data, group_id: group_id || data.group_id, description: description || data.description },
        error: null
      })
    }),

    assignLoadTaskResult: assign({
      task: (_, { data }) => ({ data: data.data.tasks[0] || {}, error: null })
    }),

    assignLoadTaskError: assign({
      task: ({ task: { data }}, { data: { message: error } }) => ({ data, error })
    }),

    assignSaveTaskResult: assign({
      task: (_, { data: result }) => {
        const { update_tasks, insert_tasks } = result.data;
        const data = update_tasks
          ? update_tasks.returning[0]
          : insert_tasks.returning[0];

        return { data, error: null };
      }
    }),

    assignSaveTaskError: assign({
      task: ({ task: { data } }, { data: error }) => ({ data, error })
    }),

    createGroup: assign({
      group: () => ({ data: {}, error: null })
    }),

    assignGroupUpdates: assign({
      group: ({ group: { data }}, { group }) => ({ data: { ...data, ...group }, error: null })
    }),

    assignLoadGroupResult: assign({
      group: (_, { data: result }) => ({ data: result.data.groups[0], error: null })
    }),

    assignLoadGroupError: assign({
      group: ({ group: { data } }, { data: { message: error } }) => ({ data, error })
    }),

    assignSaveGroupResult: assign({
      group: (_, { data: result }) => {
        const { insert_groups, update_groups } = result.data;
        const newData = insert_groups ? insert_groups.returning[0] : update_groups.returning[0];
        return { data: newData, error: null }
      }
    }),

    assignSaveGroupError: assign({
      group: ({ group: { data }}, { data: { message: error } }) => ({ data, error })
    }),

    assignLoadCalendarResult: assign({
      calendar: (_, { data: result }) => ({ data: result.data.task_count_by_date, error: null })
    }),

    assignLoadCalendarError: assign({
      calendar: ({ calendar: { data }}, { data: { message: error } }) => ({ data, error })
    }),

    assignLoadDayResult: assign({
      day: (_, { data: result }) => ({ data: result.data.tasks, error: null })
    }),

    assignLoadDayError: assign({
      day: ({ calendar: { data }}, { data: { message: error } }) => ({ data, error })
    }),

    assignLoadGroupListResult: assign({
      groupList: (_, { data: result }) => ({ data: result.data.groups, error: null })
    }),

    assignLoadGroupListError: assign({
      groupList: ({ data }, { data: { message: error } }) => ({ data, error })
    }),

    addToNavHistory: assign({
      navigationHistory: ({ navigationHistory }, event) => navigationHistory.concat(event)
    }),

    popFromNavHistory: assign({
      navigationHistory: ({ navigationHistory }) => navigationHistory.slice(0, -2)
    }),

    navigateBack: send(({ navigationHistory }) => navigationHistory[navigationHistory.length - 2])
  },
  services: {
    login: () => {
      if (isCallbackUrl())
        return new Promise((resolve, reject) => {
          webAuth.parseHash((err, authResult) => {
            if (err)
              reject(err);

            window.history.replaceState(null, '', '/');

            resolve(authResult);
          })
        });

      webAuth.authorize();
      return Promise.resolve('PENDING');
    },

    loadTask: ({ task: { id: currentId }}, { id: eventId }) => eventId || currentId
      ? apolloClient.query({ query: GET_TASK_BY_ID, variables: { id: eventId || currentId }, fetchPolicy: 'network-only' })
      : apolloClient.query({ query: GET_CURRENT_TASK, fetchPolicy: 'network-only' }),

    saveTask: ({ task: { data: { id, group_id, description, start, end } } }) => id
      ? apolloClient.mutate({ mutation: UPDATE_TASK, variables: { id, group_id, description, start, end } })
      : apolloClient.mutate({ mutation: CREATE_TASK, variables: { id: cuid(), group_id, description, start, end }}),

    loadGroup: (_, { id }) =>
      apolloClient.query({ query: GET_GROUP_BY_ID, variables: { id }, fetchPolicy: 'network-only' }),

    saveGroup: ({ group: { data: { id, color, description } }}) => id
      ? apolloClient.mutate({ mutation: UPDATE_GROUP, variables: { id, color, description } })
      : apolloClient.mutate({ mutation: CREATE_GROUP, variables: { id: cuid(), color, description }}),

    loadCalendar: () =>
      apolloClient.query({ query: GET_TASK_COUNT_BY_DATE, fetchPolicy: 'network-only' }),

    loadDay: (_, { date }) =>
      apolloClient.query({ query: GET_TASKS_BY_DATE, variables: timestampRangeFromDate(date ? date : new Date()), fetchPolicy: 'network-only' }),

    loadGroups: () =>
      apolloClient.query({ query: GET_GROUPS, fetchPolicy: 'network-only' }),
  },
  guards: {
    isCallbackUrl,
    isLoginPending: (_, { data }) => data === 'PENDING',

    isTaskFinished: ({ task: { data: { id, description, start, end } = {} } = {} }) =>
      id && description && start && end,
    isTaskRunning: ({ task: { data: { id, description, start } = {} } = {} }) =>
      id && description && start,
    isTaskReady: ({ task: { data: { description } = {} } = {} }) =>
      description,

    isGroupValid: ({ group: { data: { description } = {} } = {} }) =>
      description,

    hasNavHistory: ({ navigationHistory }) => navigationHistory.length > 1,
  }
});

function timestampRangeFromDate(date) {
  return {
    after: new Date(date),
    before: new Date(new Date(date).getTime() + 1000 * 60 * 60 * 24 - 1)
  };
}

function isCallbackUrl() {
  const location = window.location;
  const isCallback = location && location.pathname.startsWith('/callback');
  const hasResult = location && /access_token|id_token|error/.test(location.hash);

  return isCallback && hasResult;
}
