import { assign, Machine, send, sendParent, spawn } from "xstate";

export const WebSocketMachine = Machine({
  id: 'websocket-machine',
  context: {
    url: undefined,
    protocols: undefined,
    service: undefined,
  },
  initial: 'connecting',
  states: {
    connecting: {
      entry: 'startService',
      on: {
        'ws.open': {
          target: 'connected'
        }
      }
    },
    connected: {
      entry: 'sendConnected',
      exit: 'stopService',
      on: {
        'ws.close': {
          target: 'closed',
        },
        WEBSOCKET_SEND: {
          actions: 'websocketSend'
        }
      }
    },
    closed: {
      entry: 'sendClosed'
    }
  },
  on: {
    'ws.error': {
      actions: 'sendError'
    },
    'ws.message': {
      actions: 'sendMessage',
    },
  }
},{
  actions: {
    startService: assign({
      service: ({ service, url, protocols }) => spawn(
        (callback, onReceived) => {
          if (service)
            service.stop();

          const ws = protocols ? new WebSocket(url, protocols) : new WebSocket(url);

          ws.onclose = event => callback({ type: 'ws.close', event });
          ws.onerror = event => callback({ type: 'ws.error', event });
          ws.onopen = event => callback({ type: 'ws.open', event });
          ws.onmessage = event => callback({ type: 'ws.message', event });

          onReceived(({ type, data }) => {
            if (type === 'ws.close')
              ws.close();

            if (type === 'ws.send')
              ws.send(typeof data === 'string' ? data : JSON.stringify(data));
          });

          return () => ws.close();
        },
        { name: 'ws-service' }
      )
    }),

    stopService: assign({
      service: ({ service }) => {
        if (service)
          service.stop();

        return undefined;
      }
    }),

    sendConnected: sendParent(({ url }) => ({
      type: 'WEBSOCKET_CONNECTED',
      origin: url
    })),

    sendClosed: sendParent(({ url }) => ({
      type: 'WEBSOCKET_CLOSED',
      origin: url,
    })),

    sendError: sendParent(({ url }, { event }) => ({
      type: 'WEBSOCKET_ERROR',
      origin: url,
      error: event
    })),

    sendMessage: sendParent(({ url }, { event }) => ({
      type: 'WEBSOCKET_MESSAGE',
      origin: url,
      message: JSON.parse(event.data)
    })),

    websocketSend: send(
      (_, { data }) => ({ type: 'ws.send', data }),
      { to: 'ws-service' }
    )
  },
});