import { Machine, assign, sendParent, forwardTo, spawn } from 'xstate';
import { WebSocketLink } from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import MessageTypes from 'subscriptions-transport-ws/dist/message-types';

export const WebsocketLinkMachine = Machine({
  id: 'websocket-link-machine',
  context: {
    uri: null,
    link: null,
    service: null,
  },
  initial: 'initializing',
  states: {
    initializing: {
      entry: 'createService',
      on: {
        SET_LINK: {
          actions: 'setLink'
        }
      }
    },
    connected: {
      entry: 'sendConnectedToParent',
      on: {
        API_TOKEN: {
          actions: 'restartConnection'
        }
      }
    },
    disconnected: {
      entry: 'sendConnectedToParent',
    },
  },
  on: {
    CONNECTED: {
      target: 'connected',
    },
    DISCONNECTED: {
      target: 'disconnected',
    },
    ERROR: {
      actions: 'sendErrorToParent'
    },
    'link.getToken': {
      actions: sendParent('link.getToken')
    },
    API_TOKEN: {
      actions: forwardTo('link-service')
    },
    RESTART_CONNECTION: {
      actions: 'restartConnection'
    }
  }
},{
  actions: {
    createService: assign({
      service: (({ uri }) => spawn(
        (callback, onReceive) => {
          let resolveConnectionParams = null;

          onReceive(({ type, value }) => {
            if (type === 'API_TOKEN') {
              console.log('onApiToken');
              resolveConnectionParams &&
              resolveConnectionParams({
                headers: {
                  Authorization: `Bearer ${value}`
                }
              })
            }
          });

          const connectionParams = () => {
            console.log('connectionParams()');
            const promise = new Promise(resolve => resolveConnectionParams = resolve)
              .then(data => { console.log('connectionParams: ', data); return data; });

            callback('link.getToken');
            return promise;
          };

          const link = new WebSocketLink(
            new SubscriptionClient(uri, {
              options: {
                reconnect: true,
                // lazy: true,
                connectionCallback: error => console.log('websocket error: ', error)
              },
              connectionParams
            })
          );

          link.subscriptionClient.client.onerror(error => console.log('client error', error));

          link.subscriptionClient.onConnected(data => {
            console.log('websocket connected');
            callback({ type: 'CONNECTED', data })
          });
          link.subscriptionClient.onReconnected(() => {
            console.log('websocket reconnected');
            callback({ type: 'CONNECTED' })
          });
          link.subscriptionClient.onDisconnected(data => callback({ type: 'DISCONNECTED', data }));
          link.subscriptionClient.onError(data => {
            console.log('websocket error ', data);
            callback({ type: 'ERROR', data })
          });

          callback({ type: 'SET_LINK', link });
        },
        { name: 'link-service' }
      ))
    }),

    setLink: assign({
      link: (_, { link }) => link,
    }),

    restartConnection: ({ link }) => {
      const client = link.subscriptionClient;
      const operations = { ...client.operations };

      client.close(false);
      client.connect();

      Object.keys(operations).forEach(id => {
        client.sendMessage(
          id,
          MessageTypes.GQL_START,
          operations[id].options,
        );
      });

      client.operations = operations;
    },

    sendConnectedToParent: sendParent('WEBSOCKET_CONNECTED'),
    sendDisconnectedToParent: sendParent('WEBSOCKET_DISCONNECTED'),
    sendErrorToParent: sendParent((_, { data }) => ({
      type: 'WEBSOCKET_ERROR',
      data
    })),
  }
});