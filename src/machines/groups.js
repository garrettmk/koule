import { spawn, assign } from "xstate";
import { SUBSCRIBE_GROUP_LIST } from "../queries";

export default {
  context: {
    groups: {
      data: [],
      error: null,
      subscription: null
    }
  },

  states: {
    groups: {
      initial: 'idle',
      states: {
        loading: {
          entry: 'spawnSubscribeGroups',
          on: {
            SUBSCRIBE_GROUPS_RESULT: {
              target: 'idle',
              actions: 'assignSubscribeGroupsResult',
            },
            '*': undefined
          }
        },
        idle: {},
        error: {}
      },
      on: {
        LOAD_GROUPS: { target: '.loading' },
        SUBSCRIBE_GROUPS_RESULT: { target: '.idle', actions: 'assignSubscribeGroupsResult' }
      }
    }
  },

  actions: {
    spawnSubscribeGroups: assign({
      groups: ({ groups, apollo }) => {
        if (groups.subscription)
          groups.subscription.stop();

        const groups$ = apollo
          .subscribe({ query: SUBSCRIBE_GROUP_LIST })
          .map(response => ({ type: 'SUBSCRIBE_GROUPS_RESULT', response }));

        return { ...groups, subscription: spawn(groups$) };
      }
    }),

    assignSubscribeGroupsResult: assign({
      groups: ({ groups }, { response }) => ({
        ...groups,
        data: response.data.groups || [],
        error: undefined
      })
    })
  },

  services: {

  },

  guards: {

  }
}