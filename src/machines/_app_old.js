import { Machine, assign, send, spawn } from 'xstate';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { split } from 'apollo-link';
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from 'apollo-utilities';

import {
  CREATE_GROUP,
  SUBSCRIBE_CALENDAR,
  SUBSCRIBE_CURRENT_TASK,
  SUBSCRIBE_GROUP,
  SUBSCRIBE_GROUP_LIST,
  SUBSCRIBE_TASK_BY_ID,
  SUBSCRIBE_TASKS_BY_DATE,
  UPDATE_GROUP,
  UPDATE_TASK,
  CREATE_TASK
} from "../queries";
import auth0 from 'auth0-js';
import authConfig from '../config/auth';
import cuid from 'cuid';
import { Observable } from "rxjs";
import { SubscriptionClient } from "subscriptions-transport-ws";

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
          },
          invoke: {
            id: 'browser-nav-listener',
            src: 'listenToBrowserNavigation',
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
          },
        },
        finished: {},
        loading: {
          entry: 'spawnTaskSubscription',
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
        NEW_TASK: { target: '.invalid', actions: 'newTask' },
        UPDATE_TASK: { target: '.invalid', actions: 'assignTaskUpdates' },
        SAVE_TASK: '.saving',
        LOAD_TASK: '.loading',
        SUBSCRIBE_TASK_RESULT: { target: '.invalid', actions: 'assignSubscribeTaskResult' }
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
          entry: 'spawnGroupSubscription',
          on: {
            SUBSCRIBE_GROUP_RESULT: { target: 'invalid', actions: 'assignSubscribeGrouResult' },
            '*': undefined,
          },
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
        LOAD_GROUP: '.loading',
        SUBSCRIBE_GROUP_RESULT: { target: '.invalid', actions: 'assignSubscribeGroupResult' },
      }
    },
    calendar: {
      initial: 'idle',
      states: {
        loading: {
          entry: 'spawnCalendarSubscription',
          on: {
            SUBSCRIBE_CALENDAR_RESULT: { target: 'idle', actions: 'assignSubscribeCalendarResult' },
            '*': undefined,
          },
        },
        idle: {},
        error: {},
      },
      on: {
        LOAD_CALENDAR: '.loading',
        SUBSCRIBE_CALENDAR_RESULT: { target: '.idle', actions: 'assignSubscribeCalendarResult' }
      }
    },
    day: {
      initial: 'idle',
      states: {
        loading: {
          entry: 'spawnDaySubscription',
          on: {
            SUBSCRIBE_DAY_RESULT: { target: 'idle', actions: 'assignSubscribeDayResult' },
            '*': undefined,
          },
        },
        idle: {},
        error: {}
      },
      on: {
        LOAD_DAY: '.loading',
        SUBSCRIBE_DAY_RESULT: { target: '.idle', actions: 'assignSubscribeDayResult' }
      }
    },
    groupList: {
      initial: 'idle',
      states: {
        loading: {
          entry: 'spawnGroupListSubscription',
          on: {
            SUBSCRIBE_GROUP_LIST_RESULT: { target: 'idle', actions: 'assignSubscribeGroupListResult' },
            '*': undefined,
          }
        },
        idle: {},
        error: {}
      },
      on: {
        LOAD_GROUP_LIST: { target: '.loading' },
        SUBSCRIBE_GROUP_LIST_RESULT: { target: '.idle', actions: 'assignSubscribeGroupListResult' }
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
      const httpLink = new HttpLink({
        uri: 'http://koule-api.herokuapp.com/v1/graphql',
        headers: { Authorization: 'Bearer ' + auth.idToken },
      });

      const wsLink = new WebSocketLink(
        new SubscriptionClient('ws://koule-api.herokuapp.com/v1/graphql', {
          options: { reconnect: true },
          connectionParams: {
            headers: {
              Authorization: 'Bearer ' + auth.idToken
            }
          }
        }));

      const link = split(
        ({ query }) => {
          const { kind, operation } = getMainDefinition(query);
          return kind === 'OperationDefinition' && operation === 'subscription';
        },
        wsLink,
        httpLink
      );

      apolloClient = new ApolloClient({
        cache: new InMemoryCache(),
        link,
        defaultOptions: { fetchPoliciy: 'network-only' }
      })
    },

    signOut: assign(context => {
      webAuth.logout();

      return {
        ...context,
        auth: null
      }
    }),

    newTask: assign({
      task: ({ task }) => {
        if (task.subscription)
          task.subscription.stop();

        return { data: {} }
      }
    }),

    startTask: assign({
      task: ({ task }) => ({
        ...task,
        data: { ...task.data, start: new Date().toISOString() }
      }),
    }),

    finishTask: assign({
      task: ({ task }) => ({
        ...task,
        data: { ...task.data, end: new Date().toISOString() }
      })
    }),

    assignTaskUpdates: assign({
      task: ({ task }, { task: eventData  }) => {
        const { group, description } = { ...task.data, ...eventData };
        const data = { id: task.id || eventData.id, group, description };

        return {
          ...task,
          data,
        };
      }
    }),

    spawnTaskSubscription:  assign({
      task: ({ task }, event) => {
        if (task.data.id === event.id && task.subscription)
          return task;

        if (task.subscription)
          task.subscription.stop();

        const subscription = (task.data.id || event.id
          ? apolloClient.subscribe({ query: SUBSCRIBE_TASK_BY_ID, variables: { id: event.id || task.data.id } })
          : apolloClient.subscribe({ query: SUBSCRIBE_CURRENT_TASK }))
          .map(response => ({ type: 'SUBSCRIBE_TASK_RESULT', data: response }));

        return { ...task, subscription: spawn(subscription) };
      }
    }),

    assignSubscribeTaskResult: assign({
      task: ({ task }, { data }) => ({
        ...task,
        data: data.data.tasks[0] || {},
        error: undefined
      })
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
        const data = update_tasks
          ? update_tasks.returning[0]
          : insert_tasks.returning[0];

        return { ...task, data, error: undefined };
      }
    }),

    assignSaveTaskError: assign({
      task: ({ task }, { data: error }) => ({
        ...task,
        error
      })
    }),

    createGroup: assign({
      group: ({ group }) => {
        if (group.subscription)
          group.subscription.stop();

        return { data: {} };
      }
    }),

    spawnGroupSubscription: assign({
      group: ({ group }, { id }) => {
        if (group.subscription)
          group.subscription.stop();

        const subscription$ = apolloClient
          .subscribe({ query: SUBSCRIBE_GROUP, variables: { id } })
          .map(response => ({ type: 'SUBSCRIBE_GROUP_RESULT', data: response }));

        return {
          ...group,
          subscription: spawn(subscription$)
        };
      }
    }),

    assignGroupUpdates: assign({
      group: ({ group: contextGroup }, { group: eventData }) => ({
        ...contextGroup,
        data: { ...contextGroup.data, ...eventData },
      })
    }),

    assignSubscribeGroupResult: assign({
      group: ({ group }, { data: result }) => ({
        ...group,
        data: result.data.groups[0],
        error: undefined
      })
    }),

    assignSubscribeGroupError: assign({
      group: ({ group }, { data: error }) => ({
        ...group,
        error
      })
    }),

    assignSaveGroupResult: assign({
      group: ({ group }, { data: result }) => {
        const { insert_groups, update_groups } = result.data;
        const newData = insert_groups ? insert_groups.returning[0] : update_groups.returning[0];
        return { ...group, data: newData };
      }
    }),

    assignSaveGroupError: assign({
      group: ({ group}, { data: error }) => ({
        ...group,
        error
      })
    }),

    spawnCalendarSubscription: assign({
      calendar: ({ calendar }) => {
        if (calendar.subscription)
          calendar.subscription.stop();

        const subscription$ = apolloClient
          .subscribe({ query: SUBSCRIBE_CALENDAR })
          .map(response => ({ type: 'SUBSCRIBE_CALENDAR_RESULT', data: response }));

        return {
          ...calendar,
          subscription: spawn(subscription$)
        };
      }
    }),

    assignSubscribeCalendarResult: assign({
      calendar: ({ calendar }, { data: result }) => ({
        ...calendar,
        data: result.data.task_count_by_date,
        error: undefined
      })
    }),

    assignSubscribeCalendarError: assign({
      calendar: ({ calendar }, { data: error }) => ({
        ...calendar,
        error
      })
    }),

    spawnDaySubscription:  assign({
      day: ({ day }, { date }) => {
        if (day.subscription)
          day.subscription.stop();

        const subscription = apolloClient
          .subscribe({ query: SUBSCRIBE_TASKS_BY_DATE, variables: timestampRangeFromDate(date ? date : new Date()) })
          .map(response => ({ type: 'SUBSCRIBE_DAY_RESULT', data: response }));

        return { ...day, subscription: spawn(subscription) };
      }
    }),

    assignSubscribeDayResult: assign({
      day: ({ day }, { data: result }) => ({ ...day, data: result.data.tasks })
    }),

    assignSubscribeDayError: assign({
      day: ({ calendar: { data }}, { data: error }) => ({ data, error })
    }),

    spawnGroupListSubscription: assign({
      groupList: ({ groupList }) => {
        if (groupList.subscription)
          groupList.subscription.stop();

        const subscription$ = apolloClient
          .subscribe({ query: SUBSCRIBE_GROUP_LIST })
          .map(response => ({ type: 'SUBSCRIBE_GROUP_LIST_RESULT', data: response }));

        return {
          ...groupList,
          subscription: spawn(subscription$)
        }
      }
    }),

    assignSubscribeGroupListResult: assign({
      groupList: ({ groupList }, { data: result }) => {
        if (result.type === 'error')
          return { ...groupList, error: result.payload.errors[0].message };

        return { ...groupList, data: result.data.groups, error: undefined };
      }
    }),

    assignSubscribeGroupListError: assign({
      groupList: ({ groupList }, { data: { message: error } }) => ({
        ...groupList,
        error
      })
    }),

    addToNavHistory: assign({
      navigationHistory: ({ navigationHistory }, event) => {
        window.history.pushState(event, '', '');
        return navigationHistory.concat(event);
      }
    }),

    popFromNavHistory: assign({
      navigationHistory: ({ navigationHistory }) => navigationHistory.slice(0, -2)
    }),

    navigateBack: send(({ navigationHistory }) => navigationHistory[navigationHistory.length - 2]),
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

    saveTask: ({ task: { data: contextData } }, { data: eventData }) => {
      const { group: { id: group_id }, description, start, end } = { ...contextData, ...eventData };
      const updateData = { id: contextData.id, group_id, description, start, end };
      const createData = { id: eventData && eventData.id ? eventData.id : cuid(), group_id, description, start, end };

      return contextData.id
        ? apolloClient.mutate({ mutation: UPDATE_TASK, variables: updateData })
        : apolloClient.mutate({ mutation: CREATE_TASK, variables: createData });
    },

    saveGroup: ({ group: { data: contextData }}, { data: eventData}) => {
      const { color, description } = { ...contextData, ...eventData };
      const updateData = { id: contextData.id, color, description };
      const saveData = { id: eventData && eventData.id ? eventData.id : cuid(), color, description };

      return contextData.id
        ? apolloClient.mutate({ mutation: UPDATE_GROUP, variables: updateData })
        : apolloClient.mutate({ mutation: CREATE_GROUP, variables: saveData })
    },

    listenToBrowserNavigation: () => Observable.create(
      observer => {
        window.onpopstate = event => observer.next({ type: 'NAVIGATE_BACK' });
        return () => window.onpopstate = null;
      }
    ),
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
    isTaskSubscribed: ({ task }, event) => task.id === event.id && task.subscription,

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
