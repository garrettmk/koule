import { Machine, assign, spawn, sendParent } from "xstate";

const expireInterval = callback => {
  const intervalId = setInterval(
    () => callback('EXPIRE_EVENT'),
    3000
  );

  return () => clearInterval(intervalId);
};

export const NotificationMachine = Machine({
  id: 'notification-machine',
  context: {
    events: [],
    interval: null,
  },
  initial: 'running',
  states: {
    running: {
      on: {
        EXPIRE_EVENT: {
          actions: ['expireEvent', 'refreshUI'],
        },

        '*': {
          cond: 'isMatchingEvent',
          actions: ['logEvent', 'refreshUI'],
        }
      }
    }
  }
},{
  actions: {
    logEvent: assign({
      events: ({ events }, event) => [...events, event],
      interval: ({ interval }) => interval || spawn(expireInterval),
    }),

    expireEvent: assign({
      events: ({ events }, event) => events.slice(1),
      interval: ({ interval, events }) => {
        if (events.length > 1)
          return interval;

        interval.stop();
        return null;
      }
    }),

    refreshUI: sendParent('REFRESH_UI'),
  },

  guards: {
    isMatchingEvent: (_, { type }) => [
      'NETWORK_ONLINE',
      'PAGE_VISIBLE',
      'WEBSOCKETS_ERROR',
      'WEBSOCKETS_DISCONNECTED'
    ].includes(type),
  }
});