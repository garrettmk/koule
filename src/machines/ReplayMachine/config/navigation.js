import { assign, sendParent } from 'xstate';
import { defaultConfig } from "./default";

export const navigationReplay = {
  guards: {
    ...defaultConfig.guards,

    isRecordEvent: (_, { type }) => type === 'RECORD_NAVIGATION',
    isPauseEvent: (_, { type }) => type === 'PAUSE_NAVIGATION_RECORDING',
    isMatchingEvent: (_, { type }) => type.startsWith('NAVIGATE_') && type !== 'NAVIGATE_BACK',
    isReplayLastEvent: (_, { type }) => type === 'NAVIGATE_BACK',
    isReplayAllEvent: () => false,
  },

  actions: {
    ...defaultConfig.actions,

    replayLastEvent: sendParent(({ history }) => history.length > 1
      ? history[history.length - 2]
      : ''
    ),

    popLastEvent: assign({
      history: ({ history }) => history.slice(0, -2),
    })
  }
};