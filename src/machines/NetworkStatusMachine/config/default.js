import { assign, sendParent, spawn } from 'xstate';

const eventListener = callback => {
  const onOnline = () => callback('NETWORK_ONLINE');
  const onOffline = () => callback('NETWORK_OFFLINE');

  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};

export const defaultConfig = {
  actions: {
    initialize: assign({
      eventListener: () => spawn(eventListener),
    }),

    sendOnline: sendParent('NETWORK_ONLINE'),
    sendOffline: sendParent('NETWORK_OFFLINE'),
  },

  guards: {
    isOnline: () => window.navigator.onLine,
  }
};