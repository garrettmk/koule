import { Machine, assign, send, sendParent, spawn } from 'xstate';
import { WebSocketMachine } from "../WebSocketMachine";
import { SUBSCRIBE_TASKS } from "../../queries";
import { getOperationDefinition } from "./utils";


export const SubscriptionClientMachine = Machine({
  id: 'subscription-client-machine',
  context: {
    url: null,
    websocket: null,
    subscriptions: {},
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
          target: 'closed'
        },
        ID_TOKEN: {
          actions: 'sendInitMessage'
        },
        WEBSOCKET_MESSAGE: [
          { cond: 'isConnectionAck', target: 'connected' },
          { cond: 'isConnectionError', target: 'closed' }
        ]
      }
    },
    connected: {
      on: {
        WEBSOCKET_CLOSED: {
          target: 'closed'
        },
        SUBSCRIPTION_START: {
          actions: 'startSubscription'
        },
        WEBSOCKET_MESSAGE: [
          { cond: 'isSubscriptionResult', actions: 'sendSubscriptionResult' },
          { cond: 'isSubscriptionError', actions: 'sendSubscriptionError' }
        ]
      }
    },
    closed: {
      entry: 'closeWebSocketService'
    }
  },
},{
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
      (_, { value }) => ({
        type: 'WEBSOCKET_SEND',
        data: {
          type: 'connection_init',
          payload: {
            headers: {
              Authorization: 'Bearer ' + value,
            }
          }
        }
      }),
      { to: 'websocket' }
    ),

    startSubscription: assign({
      subscriptions: ({ subscriptions, websocket }, { query, variables = {} }) => {
        debugger;
        const { name: operationName } = getOperationDefinition(query);
        const queryString = query.loc.source.body;
        const id = subscriptions
          ? (Math.max(0, ...Object.keys(subscriptions)) + 1).toString()
          : '1';

        const subscription = {
          id,
          type: 'start',
          payload: {
            variables,
            extensions: {},
            operationName,
            query: queryString
          }
        };

        websocket.send({
          type: 'WEBSOCKET_SEND',
          data: subscription
        });

        return {
          ...subscriptions,
          [id]: subscription
        };
      }
    }),

    sendSubscriptionResult: sendParent(({ subscriptions }, { message }) => {
      debugger;
      const { id, payload } = message;
      const operationName = subscriptions[id].payload.operationName;

      const result = {
        type: 'SUBSCRIPTION_RESULT',
        name: operationName,
        data: payload.data
      };

      console.log(result);
      return result;
    }),

    sendSubscriptionError: sendParent(({ subscriptions }, { message }) => {
      const { id, payload } = message;
      const operationName = subscriptions[id].payload.operationName;

      const result = {
        type: 'SUBSCRIPTION_ERROR',
        name: operationName,
        data: payload
      };

      console.log(result);
      return result;
    })
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

    isSubscriptionResult: (_, { message }) => {
      const { type } = message;
      return type === 'data';
    },

    isSubscriptionError: (_, { message }) => {
      const { type } = message;
      return type === 'error';
    },
  }
})