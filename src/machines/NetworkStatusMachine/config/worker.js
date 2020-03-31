import { assign, sendParent, spawn } from "xstate";

const eventListener = (callback, receive) => {
  const onOnline = () => callback('NETWORK_ONLINE');
  const onOffline = () => callback('NETWORK_OFFLINE');

  self.addEventListener('online', onOnline);
  self.addEventListener('offline', onOffline);

  return () => {
    self.removeEventListener('online', onOnline);
    self.removeEventListener('offline', onOffline);
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
    isOnline: () => self.navigator.onLine,
  }
};