import { Machine } from 'xstate';
import { defaultConfig } from "./config";

export const PageVisibilityMachine = Machine({
  id: 'page-visibility-machine',
  context: {},
  initial: 'initializing',
  states: {
    initializing: {
      entry: 'initialize',
      on: {
        '': [
          { cond: 'isVisible', target: 'visible' },
          { target: 'hidden' }
        ]
      }
    },

    visible: {
      entry: 'sendVisible',
      on: {
        PAGE_HIDDEN: 'hidden',
      }
    },

    hidden: {
      entry: 'sendHidden',
      on: {
        PAGE_VISIBLE: 'visible'
      }
    }
  }
}, defaultConfig);