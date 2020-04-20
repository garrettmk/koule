import { Machine, assign, send, sendParent, spawn } from "xstate";
import { SubscriptionClientMachine } from "./SubscriptionClientMachine";
import { PromiseMachine } from "../PromiseMachine";
import { getOperationDefinition } from "./utils";


export const ApiMachine = Machine({
  id: 'api-machine',
  context: {
    url: null,
    operations: {},
    subscriptionClient: null,
    running: []
  },
  initial: 'initializing',
  states: {
    initializing: {
      entry: 'createSubscriptionClient',
      on: {
        '': 'running'
      }
    },
    running: {
      on: {
        RESOLVED: {
          actions: 'sendResultEvent',
        },

        REJECTED: {
          actions: 'sendErrorEvent'
        },

        '*': [
          { cond: 'isSubscriptionEvent', actions: 'startSubscription' },
          { cond: 'isOperationEvent', actions: 'startOperation' }
        ]
      }
    }
  },
  on: {
    SUBSCRIPTION_RESULT: {
      actions: 'sendSubscriptionResult'
    }
  }
},{
  actions: {
    createSubscriptionClient: assign({
      subscriptionClient: ({ url }) => spawn(
        SubscriptionClientMachine.withContext({ url }),
        { name: 'subscriptionClient' }
      )
    }),

    startSubscription: send(
      ({ operations }, { type, variables }) => ({
        type: 'SUBSCRIPTION_START',
        query: operations[type].body,
        variables
      }),
      { to: 'subscriptionClient' }
    ),

    startOperation: assign({
      running: ({ operations, running = [], url }, { type, variables }) => {
        const { body, onResult, onError } = operations[type];

        const opMachine = PromiseMachine.withConfig({ services: {
          promise: () => fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '
            },
            body: JSON.stringify({
              query: body.loc.source.body,
              variables
            })
          })
          .then(response => response.json())
          .then(data => ({ type: onResult, data }))
          .catch(data => ({ type: onError, data }))
        }});

        return [
          ...running,
          spawn(opMachine, { sync: true })
        ];
      }
    }),

    sendResultEvent: sendParent((_, { data }) => data),

    sendErrorEvent: sendParent((_, { data }) => data),
  },

  guards: {
    isSubscriptionEvent: ({ operations = {} }, { type }) => {
      const op = operations[type];
      if (!op) return false;

      const { body } = op;
      const { type: opType } = getOperationDefinition(body);

      return opType === 'subscription';
    },

    isOperationEvent: ({ operations = {} }, { type }) =>
      Boolean(operations[type]),
  }
});