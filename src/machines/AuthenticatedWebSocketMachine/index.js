import { Machine, assign, spawn, send, sendParent, forwardTo } from 'xstate';
import { WebSocketMachine } from "../WebSocketMachine";


export const AuthenticatedWebSocketMachine = Machine({
  id: 'authenticated-websocket-machine',
  context: {
    url: null,
    websocket: null,
  },
  initial: 'connecting',
  states: {
    connecting: {
      entry: 'createWebSocketService',
      on: {
        WEBSOCKET_CONNECTED: {
          actions: 'getToken'
        },
        WEBSOCKET_CLOSED: {
          target: 'closed',
        },
        API_TOKEN: {
          actions: 'sendInitMessage',
        },
        WEBSOCKET_MESSAGE: [
          { cond: 'isConnectionAck', target: 'connected' },
          { cond: 'isConnectionError', target: 'closed' }
        ]
      }
    },
    connected: {
      entry: 'sendConnected',
      on: {
        WEBSOCKET_CLOSED: {
          target: 'closed',
        },
        WEBSOCKET_SEND: {
          actions: 'forwardToWebSocketService'
        },
        WEBSOCKET_MESSAGE: [
          { cond: 'isKeepAliveMessage' },
          { actions: 'forwardToParent' }
        ],
        WEBSOCKET_ERROR: {
          actions: 'forwardToParent',
        }
      }
    },
    closed: {
      entry: ['closeWebSocketService', 'sendClosed']
    }
  }
}, {
  actions: {
    createWebSocketService: assign({
      websocket: ({ websocket, url }) => {
        if (websocket)
          websocket.stop();

        return spawn(
          WebSocketMachine.withContext({ url }),
          { name: 'websocket' }
        );
      }
    }),

    closeWebSocketService: assign({
      websocket: ({ websocket }) => {
        if (websocket)
          websocket.stop();

        return null;
      }
    }),

    getToken: sendParent('GET_API_TOKEN'),

    sendInitMessage: send(
      (_, { value: apiToken }) => ({
        type: 'WEBSOCKET_SEND',
        data: {
          type: 'connection_init',
          payload: {
            headers: {
              Authorization: 'Bearer ' + apiToken,
            }
          }
        }
      }),
      { to: 'websocket' }
    ),

    forwardToWebSocketService: forwardTo('websocket'),

    forwardToParent: sendParent((_, event) => event),

    sendConnected: sendParent('WEBSOCKET_CONNECTED'),

    sendClosed: sendParent('WEBSOCKET_CLOSED')
  },

  guards: {
    isConnectionAck: (_, { message }) => {
      const { type } = message;
      return type === 'connection_ack';
    },

    isConnectionError: (_, { message }) => {
      const { type } = message;
      return type === 'connection_error';
    },

    isKeepAliveMessage: (_, { message }) => {
      const { type } = message;
      return type === 'ka';
    }
  }
});