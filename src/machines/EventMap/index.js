import { Machine, sendParent } from "xstate";

export const EventMapMachine = Machine({
  id: 'event-map-machine',
  context: {
    map: {}
  },
  initial: 'running',
  states: {
    running: {
      on: {
        '': {
          cond: 'isMappedEvent',
          actions: 'sendMappedEvent'
        }
      }
    }
  }
},{
  actions: {
    sendMappedEvent: sendParent(({ map }, event) => {
      const { type } = event;
      return map[type](event);
    })
  },

  guards: {
    isMappedEvent: ({ map = {} }, { type }) => Boolean(map[type]),
  }
});