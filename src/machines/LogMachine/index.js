import { Machine } from "xstate";

export const LogMachine = Machine({
  id: 'log-machine',
  context: {
    id: '@logger'
  },
  initial: 'running',
  states: {
    running: {
      on: {
        LOGGER_PAUSE: 'paused',
        '*': {
          actions: 'logEvent'
        }
      }
    },
    paused: {
      on: {
        LOGGER_START: 'running'
      }
    }
  }
},{
  actions: {
    logEvent: ({ id }, event) => console.log(id, event)
  }
});