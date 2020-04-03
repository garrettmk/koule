import { sendParent, assign, spawn } from "xstate";

const eventListener = callback => {
  const handleVisibilityChange = () => {
    if (document.hidden)
      callback('PAGE_HIDDEN');
    else
      callback('PAGE_VISIBLE');
  };

  document.addEventListener('visibilitychange', handleVisibilityChange, false);

  return () => document.removeEventListener('visiblitychange', handleVisibilityChange);
};

export const defaultConfig = {
  actions: {
    sendVisible: sendParent('PAGE_VISIBLE'),

    sendHidden: sendParent('PAGE_HIDDEN'),

    initialize: assign({
      eventListener: () => spawn(eventListener),
    }),
  },

  guards: {
    isVisible: () => !Boolean(document.hidden)
  },
};