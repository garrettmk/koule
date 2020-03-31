import { assign, sendParent } from "xstate";
import { defaultConfig } from "./default";

export const offlineReplay = {
  guards: {
    ...defaultConfig.guards,

    isRecordEvent: (_, { type }) => type === 'NETWORK_OFFLINE',
    isPauseEvent: (_, { type }) => type === 'NETWORK_ONLINE',
    isReplayLastEvent: () => false,
    isReplayAllEvent: (_, { type }) => type === 'API_READY',
    isMatchingEvent: (_, { type }) =>
      type === 'RECORD_MUTATION' ||
      (type.startsWith('UPDATE_') && !type.includes('ERROR')),
  },

  actions: {
    ...defaultConfig.actions,

    assignToHistory: assign({
      history: ({ history }, event) => event.type === 'RECORD_MUTATION'
        ? history.concat(event.event)
        : history.concat(event),
    }),
  }
};