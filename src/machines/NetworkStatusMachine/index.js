import { Machine, sendParent } from "xstate";


export const NetworkStatusMachine = Machine({
  id: 'network-status-machine',
  context: {},
  initial: 'initializing',
  states: {
    initializing: {
      entry: 'initialize',
      on: {
        '': [
          { cond: 'isOnline', target: 'online' },
          { target: 'offline' }
        ]
      }
    },
    online: {
      entry: 'sendOnline',
      on: {
        NETWORK_OFFLINE: 'offline'
      }
    },
    offline: {
      entry: 'sendOffline',
      on: {
        NETWORK_ONLINE: 'online'
      }
    }
  }
});

export * from './config';