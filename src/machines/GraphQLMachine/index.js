import { Machine, assign, send, sendParent, spawn } from 'xstate';
import { WebSocketMachine } from "../WebSocketMachine";

export const GraphQLMachine = Machine({
  id: 'graphql-machine',
  context: {
    url: null,
    websocket: null,
    subscriptions: [],
    queries: [],
    mutations: [],
  },
  initial: 'running',
  states: {
    running: {
      on: {
        SUBSCRIBE: [
          { actions: ['assignSubscription', 'sendSubscriptionToWebSocket'] }
        ]
      }
    }
  },
  on: {

  }
},{
  actions: {
    assignSubscription: assign({
      websocket: ({ websocket, url }) => {
        if (websocket) return websocket;

        const wsUrl = url.replace('http', 'ws');

        return spawn(
          WebSocketMachine.withContext({ url: wsUrl }),
          { name: 'websocket' }
        );
      },

      subscriptions: ({ subscriptions = [] }, event) => {

      }
    })
  }
});