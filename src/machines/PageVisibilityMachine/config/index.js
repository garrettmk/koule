import { sendParent, assign, spawn } from "xstate";

const eventListener = callback => {
  const handlePageShow = () => callback('PAGE_VISIBLE');
  const handlePageHide = () => callback('PAGE_HIDDEN');
  const handleVisibilityChange = () => document.hidden
    ? callback('PAGE_HIDDEN')
    : callback('PAGE_VISIBLE');

  window.addEventListener('pageshow', handlePageShow);
  window.addEventListener('pagehide', handlePageHide);
  document.addEventListener('visibilitychange', handleVisibilityChange, false);

  return () => {
    document.removeEventListener('visiblitychange', handleVisibilityChange);
  }
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