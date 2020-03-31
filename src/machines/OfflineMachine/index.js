import { Machine, assign, sendParent } from "xstate";


export const OfflineMachine = Machine({
  id: 'offline-machine',
  context: {
    cache: [],
  },
  initial: 'initializing',
  states: {
    initializing: {
      entry: ['initialize', 'loadFromStorage'],
      on: {
        '': 'running'
      }
    },
    running: {
      on: {
        API_READY: {
          cond: 'hasCachedEvents',
          target: 'sendCachedEvents'
        },
        '*': {
          cond: 'shouldCacheEvent',
          actions: 'cacheEvent'
        }
      }
    },
    sendCachedEvents: {
      entry: 'sendFirstEvent',
      exit: 'removeFirstEvent',
      on: {
        '': [
          { cond: 'hasCachedEvents', target: 'sendCachedEvents', internal: false },
          { target: 'running' }
        ]
      }
    }
  }
},{
  actions: {
    initialize: () => null,
    loadFromStorage: () => null,

    cacheEvent: assign({
      cache: ({ cache }, event) => [...cache, event.event]
    }),

    sendFirstEvent: sendParent(({ cache }) => {
      return cache[0] || '';
    }),

    removeFirstEvent: assign({
      cache: ({ cache }) => {
        const [first, ...rest] = cache;
        return rest;
      }
    }),
  },

  guards: {
    shouldCacheEvent: ({ online }, { type, data }) => {
      const isUpdateError = type.startsWith('UPDATE_') && type.includes('_ERROR');

      const isNetworkError = (() => {
        try { return data.message.includes('NetworkError') }
        catch (e) { return false; }
      })();

      const isAuthError = (() => {
        try { return data.message.includes('JWT') }
        catch (e) { return false }
      })();

      return isUpdateError && (isNetworkError || isAuthError);
    },

    hasCachedEvents: ({ cache }) => {
      return cache.length > 0
    },
  }
});