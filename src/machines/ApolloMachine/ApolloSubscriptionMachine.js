import { Machine, sendParent } from 'xstate';
import { apollo } from "./ApolloMachine";

export const ApolloSubscriptionMachine = Machine({
  id: 'apollo-subscription-machine',
  context: {
    apollo: null,
    subscription: null,
    successEvent: null,
    errorEvent: null,
    variables: {},
  },
  initial: 'active',
  states: {
    active: {
      invoke: {
        id: 'subscription-service',
        src: 'subscriptionService',
        onDone: 'inactive',
      },
      on: {
        RESULT: {
          actions: 'sendResultToParent'
        }
      }
    },
    inactive: {
      type: 'final'
    }
  }
},{
  actions: {
    sendResultToParent: sendParent(({ successEvent }, { data }) => ({
      type: successEvent,
      data,
    })),
  },

  services: {
    subscriptionService: ({ subscription, variables }) => apollo
      .subscribe({ query: subscription, variables })
      .map(data => ({ type: 'RESULT', data }))
    },
});