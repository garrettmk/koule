import { Machine, assign, send, sendParent } from "xstate";
import localForage from 'localforage';

localForage.config({
  driver: [
    localForage.INDEXEDDB,
    localForage.WEBSQL
  ],
  name: 'api-cache-storage'
});


export const CacheMachine = Machine({
  id: 'apollo-cache-machine',
  context: {
    cache: {},
    pending: []
  },
  initial: 'initializing',
  states: {
    initializing: {
      invoke: {
        id: 'storage',
        src: 'loadFromStorage',
      },
      on: {
        LOADED_FROM_STORAGE: {
          actions: 'assignFromStorage',
          target: 'processingPending',
        },
        ADD: {
          actions: 'addToCache'
        },
        GET: {
          actions: 'addToPending',
        }
      }
    },

    processingPending: {
      exit: 'removeLastPending',
      on: {
        '': [
          { cond: 'hasPending', actions: 'sendLastPending', target: 'processingPending', internal: false },
          { target: 'running' }
        ]
      }
    },

    running: {
      on: {
        ADD: {
          actions: 'addToCache'
        },
        GET: {
          cond: 'existsInCache',
          actions: 'sendCachedEvent'
        }
      }
    }
  },
  on: {
    ADD: {
      actions: 'addToCache',
    },
    GET: {
      cond: 'existsInCache',
      actions: 'sendCachedEvent'
    }
  }
},{
  actions: {
    addToCache: assign({
      cache: ({ cache }, { request, response }) => {
        const key = JSON.stringify(request);
        localForage.setItem(key, response);

        return {
          ...cache,
          [key]: response
        }
      }
    }),

    sendCachedEvent: sendParent(({ cache }, { request }) => ({
      type: 'cache.response',
      response: cache[JSON.stringify(request)]
    })),

    assignFromStorage: assign({
      cache: ({ cache }, { result }) => ({
        ...cache,
        ...result
      })
    }),

    addToPending: assign({
      pending: ({ pending = [] }, event) => [...pending, event]
    }),

    sendLastPending: send(({ pending = [] }) => pending[pending.length - 1] || ''),

    removeLastPending: assign({
      pending: ({ pending = [] }) => pending.slice(0, -1)
    })
  },

  guards: {
    existsInCache: ({ cache }, { request }) => Boolean(cache[JSON.stringify(request)]),

    hasPending: ({ pending = [] }) => Boolean(pending.length),
  },

  services: {
    loadFromStorage: () => callback => {
      const result = {};

      localForage.iterate(
        (value, key) => void (result[key] = value),
        () => callback({ type: 'LOADED_FROM_STORAGE', result })
      );
    }
  }
});