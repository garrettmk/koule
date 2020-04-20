import { ExchangeMachine } from "../ExchangeMachine";
import { AuthenticatedWebSocketMachine } from "../AuthenticatedWebSocketMachine";
import { LogMachine } from "../LogMachine";
import { SUBSCRIBE_TASKS } from "../../queries";
import apiConfig from '../../config/api';
import cuid from "cuid";

function createSubscriptionEvents({
  query,
  onResult,
  onError,
  data
}) {
  const id = cuid();

  const subscriptionEvent = {
    type: 'WEBSOCKET_SEND',
    data: {
      id,
      type: 'start',
      payload: {
        query: query.loc.source.body,
      }
    }
  };

  const assignEvent = {
    type: 'exchange.assign',
    data: {
      ...data,
      [id]: { onResult, onError }
    }
  };

  return [subscriptionEvent, assignEvent];
}

export const ApiMachine2 = ExchangeMachine.withContext({
  config: {
    rules: {
      map: {
        WEBSOCKET_CONNECTED: () => ({
          type: 'SUBSCRIBE_TASK_LIST'
        }),

        GET_API_TOKEN: () => ({
          type: 'exchange.broadcast',
          toParent: true,
          toPeers: false,
          event: 'GET_ID_TOKEN'
        }),

        ID_TOKEN: (_, { value }) => ({
          type: 'API_TOKEN',
          value
        }),

        SUBSCRIBE_TASK_LIST: ({ data }) => {
          return {
            type: 'exchange.send',
            events: createSubscriptionEvents({
              query: SUBSCRIBE_TASKS,
              onResult: 'SUBSCRIBE_TASK_LIST_RESULT',
              onError: 'SUBSCRIBE_TASK_LIST_ERROR',
              data,
            })
          };
        },

        WEBSOCKET_MESSAGE: ({ data = {} }, { message }) => {
          const { id, type, payload } = message;
          const mapped = data[id];

          if (mapped && type === 'data')
            return {
              type: 'exchange.broadcast',
              event: {
                type: mapped.onResult,
                data: payload
              },
              toPeers: false,
              toParent: true
            };

          if (mapped && type === 'error')
            return {
              type: 'exchange.broadcast',
              toPeers: false,
              toParent: true,
              event: {
                type: mapped.onError,
                data: payload
              }
            };

          return {
            type: 'exchange.broadcast',
            event: {
              type: 'WEBSOCKET_MESSAGE',
              message
            }
          };
        }
      }
    },
    services: {
      logger: {
        source: LogMachine.withContext({ id: '@apiMachine2' })
      },
      websocket: {
        source: AuthenticatedWebSocketMachine.withContext({ url: apiConfig.websocketURI })
      },
    }
  }
});

