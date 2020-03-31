import { Machine, assign, sendParent, send } from "xstate";
import { defaultConfig } from "./config";

export const ReplayMachine = Machine({
  id: 'replay-machine',
  context: {
    history: []
  },
  initial: 'recording',
  states: {
    recording: {
      on: {
        '*': [
          { cond: 'isPauseEvent', target: 'paused' },
          { cond: 'isMatchingEvent', actions: ['assignToHistory', 'recordEvent'] }
        ]
      }
    },
    paused: {
      on: {
        '*': { cond: 'isRecordEvent', target: 'recording' }
      }
    },
    replayLast: {
      entry: ['replayLastEvent', send('replay.return')],
      exit: 'popLastEvent',
    },
    replayAll: {
      entry: 'replayLastEvent',
      exit: 'popLastEvent',
      on: {
        '': [
          { cond: 'isEmpty', target: 'recording' },
          { target: 'replayAll', internal: false }
        ],
      }
    },
  },
  on: {
    '*': [
      { cond: 'isReplayLastEvent', target: 'replayLast' },
      { cond: 'isReplayAllEvent', target: 'replayAll' },
    ]
  }
}, defaultConfig);


export * from './config';