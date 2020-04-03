import { assign, sendParent, spawn } from "xstate";

const eventListener = (callback, receive) => {
  const onOnline = () => callback('NETWORK_ONLINE');
  const onOffline = () => callback('NETWORK_OFFLINE');

  self.addEventListener('online', onOnline);    // eslint-disable-line no-restricted-globals
  self.addEventListener('offline', onOffline);  // eslint-disable-line no-restricted-globals

  return () => {
    self.removeEventListener('online', onOnline);   // eslint-disable-line no-restricted-globals
    self.removeEventListener('offline', onOffline); // eslint-disable-line no-restricted-globals
  };
};

export const workerConfig = {
  actions: {
    initialize: assign({
      eventListener: () => spawn(eventListener),
    }),

    sendOnline: sendParent('NETWORK_ONLINE'),
    sendOffline: sendParent('NETWORK_OFFLINE'),
  },

  guards: {
    isOnline: () => self.navigator.onLine,  // eslint-disable-line no-restricted-globals
  }
};