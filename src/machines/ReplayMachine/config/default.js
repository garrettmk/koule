import { assign, sendParent } from "xstate";

export const defaultConfig = {
  guards: {
    isRecordEvent: (_, { type }) => type === 'RECORD',
    isPauseEvent: (_, { type }) => type === 'PAUSE',
    isMatchingEvent: (_, { type }) => {
      return !['', 'RECORD', 'PAUSE', 'REPLAY_LAST', 'REPLAY_ALL'].includes(type);
    },
    isReplayLastEvent: (_, { type }) => type === 'REPLAY_LAST',
    isReplayAllEvent: (_, { type }) => type === 'REPLAY_ALL',
    isEmpty: ({ history }) => !history.length,
  },

  actions: {
    assignToHistory: assign({
      history: ({ history }, event) => history.concat(event),
    }),

    recordEvent: () => null,

    replayLastEvent: sendParent(({ history }) => {
      return history.length ? history[history.length - 1] : ''
    }),

    popLastEvent: assign({
      history: ({ history }) => history.slice(0, -1),
    }),
  }
};