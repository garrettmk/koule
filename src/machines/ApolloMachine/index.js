import { Machine, assign, spawn, send, sendParent } from "xstate";
import { log, respond } from "xstate/lib/actions";
import { ApolloLink, split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { getMainDefinition } from "apollo-utilities";
import { AuthLinkMachine } from "./AuthLinkMachine";
import { WebsocketLinkMachine } from "./WebsocketLinkMachine";
import { NetworkStatusMachine, workerConfig } from "../NetworkStatusMachine";
import { ApolloOperation } from "../ApiMachine/config/ApolloOperation";
import { CacheMachine } from "./CacheMachine";


export const ApolloMachine = Machine({
  id: 'apollo-machine',
  context: {
    config: {},
    operations: {},
    pending: [],
    services: [],
    network: null,
    cache: null,
    idToken: null,
    apollo: null,
    authLink: null,
    websocketLink: null,
  },
  initial: 'initializing',
  states: {
    initializing: {
      initial: 'creatingServices',
      states: {
        creatingServices: {
          entry: [
            'assignDefaults',
            'createNetwork',
            'createCache',
            'createAuthLink',
            'createWebsocketLink'
          ],
          on: {
            'xstate.update': {
              cond: 'areServicesReady',
              target: 'creatingApollo'
            }
          }
        },

        creatingApollo: {
          invoke: {
            src: 'createApollo',
            onDone: {
              actions: 'setApollo',
              target: '#apollo-machine.checkingAvailability'
            },
            onError: {
              target: '#apollo-machine.unavailable'
            }
          },
        }
      },
      on: {
        '*': [
          { cond: 'isSendEvent', actions: ['addToPending', 'getFromCache'] }
        ]
      }
    },

    checkingAvailability: {
      on: {
        '': [
          { cond: 'isAvailable', target: 'available' },
          { target: 'unavailable' }
        ]
      }
    },

    available: {
      entry: 'createFromPending',
      on: {
        NETWORK_OFFLINE: {
          target: 'unavailable',
        },

        WEBSOCKET_DISCONNECTED: {
          cond: 'isOnline',
          actions: 'restartWebsocket'
        },

        '*': [
          { cond: 'isSendEvent', actions: ['createOperationService', 'getFromCache'] },
          { cond: 'isAuthenticationError', actions: ['addRequestToPending', 'clearToken', 'restartWebsocket'], target: 'unavailable' },
        ]
      }
    },

    unavailable: {
      on: {
        NETWORK_ONLINE: {
          actions: 'restartWebsocket',
        },

        WEBSOCKET_CONNECTED: {
          target: 'available',
        },

        '*': [
          { cond: 'isSendEvent', actions: ['addToPending', 'getFromCache'] }
        ]
      }
    }
  },
  on: {
    REGISTER_API_OPERATIONS: {
      actions: 'registerOperations'
    },

    ID_TOKEN: {
      actions: ['setApiToken', 'forwardApiToken'],
      target: 'checkingAvailability'
    },

    'link.getToken': [
      { cond: 'isAuthorized', actions: 'respondWithToken' },
      { actions: 'getToken' }
    ],

    'cache.response': {
      actions: 'sendCachedResponse'
    },

    '*': [
      { cond: 'isCacheableSuccessEvent', actions: ['addToCache', 'forwardToParent'] },
      { cond: 'isSuccessEvent', actions: 'forwardToParent' },
      { cond: 'isErrorEvent', actions: ['forwardToParent'] }
    ]
  }
},{
  services: {
    createApollo: ({ config, authLink, websocketLink }) => {
      const { uri } = config;

      const httpLink = ApolloLink.from([
        authLink.state.context.link,
        new HttpLink({ uri })
      ]);

      const link = split(
        ({ query }) => {
          const { kind, operation } = getMainDefinition(query);
          return kind === 'OperationDefinition' && operation === 'subscription';
        },
        websocketLink.state.context.link,
        httpLink
      );

      const cache = new InMemoryCache();

      const apollo = new ApolloClient({
        cache,
        link,
        defaultOptions: { fetchPolicy: 'network-only' }
      });

      return Promise.resolve(apollo);
    }
  },

  actions: {
    assignDefaults: assign({
      config: ({ config = {} }) => config,
      operations: ({ operations = {} }) => operations,
      pending: ({ pending = [] }) => pending,
      services: ({ services = [] }) => services,
    }),

    createNetwork: assign({
      network: () => spawn(
        NetworkStatusMachine.withConfig(workerConfig),
        {
          sync: true,
          name: 'network'
        }
      )
    }),

    createAuthLink: assign({
      authLink: () => spawn(AuthLinkMachine, {
        sync: true,
        name: 'authLink'
      })
    }),

    createWebsocketLink: assign({
      websocketLink: ({ config }) => {
        const uri = new URL(config.uri);
        uri.protocol = 'wss';

        const machine = WebsocketLinkMachine.withContext({ uri: uri.href });

        return spawn(machine, {
          sync: true,
          name: 'websocketLink'
        });
      }
    }),

    createCache: assign({
      cache: () => spawn(CacheMachine, {
        name: 'cache'
      }),
    }),

    setApollo: assign({
      apollo: (_, { data }) => data
    }),

    getToken: sendParent('GET_ID_TOKEN'),

    respondWithToken: respond(({ idToken }) => ({
      type: 'API_TOKEN',
      value: idToken
    })),

    setApiToken: assign({
      idToken: (_, { value }) => value,
    }),

    clearToken: assign({
      idToken: null
    }),

    forwardApiToken: ({ authLink, websocketLink }, { value }) => {
      authLink.send({ type: 'API_TOKEN', value });
      websocketLink.send({ type: 'API_TOKEN', value });
    },

    addToPending: assign({
      pending: ({ pending }, event) => [...pending, event]
    }),

    addRequestToPending: assign({
      pending: ({ pending }, event) => [...pending, event.event]
    }),

    createOperationService: assign({
      services: ({ services, operations, apollo }, event) => {
        const { type, variables } = event;
        const operation = operations[type];
        const { body } = operation;
        const { operation: opType } = getMainDefinition(operation.body);

        const send =
          opType === 'query' ? () => apollo.query({ query: body, variables }) :
          opType === 'mutation' ? () => apollo.mutate({ mutation: body, variables }) :
          opType === 'subscription' ? () => apollo.subscribe({ query: body, variables }) :
          null;

        const service = spawn(
          ApolloOperation.withContext({ operation, event, send, type: opType }),
          { sync: true }
        );

        return [...services, service];
      }
    }),

    createFromPending: assign({
      pending: [],
      services: ({ services, operations, pending, apollo }) => {
        console.log('creating pending requests...');
        const newServices = pending.map(event => {
          const { type, variables } = event;
          const operation = operations[type];
          const { operation: opType } = getMainDefinition(operation.body);

          const send =
            opType === 'query' ? () => apollo.query({ query: operation.body, variables }) :
            opType === 'mutation' ? () => apollo.mutate({ mutation: operation.body, variables }) :
            opType === 'subscription' ? () => apollo.subscribe({ query: operation.body, variables }) :
            null;

          return spawn(
            ApolloOperation.withContext({ operation, event, send, type: opType }),
            { sync: true }
          );
        });

        return [...services, ...newServices];
      }
    }),

    restartWebsocket: send('RESTART_CONNECTION', { to: 'websocketLink' }),

    registerOperations: assign({
      operations: ({ operations }, event) => ({
        ...operations,
        ...event.operations
      })
    }),

    getFromCache: send(
      (_, request) => ({ type: 'GET', request }),
      { to: 'cache' }
    ),

    addToCache: send(
      (_, response) => {
        const request = response.event;
        return { type: 'ADD', request, response };
      },
      {
        to: 'cache'
      }
    ),

    sendCachedResponse: sendParent((_, { response }) => {
      console.log('using cached response');
      return response;
    }),
    // sendCachedResponse: log((_, { response } ) => 'Using cached response: ' + response.type),

    forwardToParent: sendParent((_, event) => event),
    // forwardToParent: log((_, { type }) => 'Sending to parent: ' + type)
  },

  guards: {
    isOnline: ({ network }) => network.state.matches('online'),

    isAuthorized: ({ idToken }) => Boolean(idToken),

    isAvailable: ({ network, websocketLink, idToken, apollo }) =>
      Boolean(idToken) &&
      Boolean(apollo) &&
      network.state.matches('online') &&
      websocketLink.state.matches('connected'),

    areServicesReady: ({ authLink, websocketLink, network, cache }) =>
      Boolean(network) &&
      Boolean(cache) &&
      Boolean(authLink && authLink.state.context.link) &&
      Boolean(websocketLink && websocketLink.state.context.link),

    isSendEvent: ({ operations = {} }, { type }) => {
      return Boolean(operations[type]);
    },

    isCacheableSuccessEvent: ({ operations = {} }, { type, operation = {} }) => {
      const successEvents = Object.values(operations).map(op => op.successEvent);
      const isSuccessEvent = successEvents.includes(type);
      const { excludeFromCache } = operation;

      return isSuccessEvent && !excludeFromCache;
    },

    isSuccessEvent: ({ operations = {} }, { type }) => {
      const successEvents = Object.values(operations).map(op => op.successEvent);
      return successEvents.includes(type);
    },

    isErrorEvent: ({ operations = {} }, { type }) => {
      const errorEvents = Object.values(operations).map(op => op.errorEvent);
      return errorEvents.includes(type);
    },

    isAuthenticationError: ({ operations = {} }, { type, data = {} }) => {
      const { message = '' } = data;
      const errorEvents = Object.values(operations).map(op => op.errorEvent);
      const isAuthError = errorEvents.includes(type) && message.includes('JWT');

      if (isAuthError)
        console.log(type, message);

      return isAuthError;
    }
  }
});