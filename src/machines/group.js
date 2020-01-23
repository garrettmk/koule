import cuid from 'cuid';
import { assign, spawn } from "xstate";
import { CREATE_GROUP, SUBSCRIBE_GROUP, UPDATE_GROUP } from "../queries";

export default {
  context: {
    group: {
      data: {},
      subscription: null,
      error: null
    }
  },

  states: {
    group: {
      initial: 'invalid',
      states: {
        invalid: {
          on: {
            '': { cond: 'isGroupValid', target: 'valid' },
            SAVE_GROUP: undefined,
          }
        },
        valid: {},
        loading: {
          entry: 'spawnGroupSubscription',
          on: {
            // '': [
            //   { cond: 'isGroupSubscribed', target: 'invalid' },
            //   { actions: 'spawnGroupSubscription' }
            // ],
            SUBSCRIBE_GROUP_RESULT: { target: 'invalid', actions: 'assignSubscribeGroupResult' },
            '*': undefined
          },
        },
        saving: {
          invoke: {
            id: 'save-group',
            src: 'saveGroup',
            onDone: { target: 'invalid', actions: 'assignSaveGroupResult' },
            onError: { target: 'error', actions: 'assignSaveGroupError' }
          },
          on: {
            '*': undefined
          }
        },
        error: {}
      },
      on: {
        CREATE_GROUP: { target: '.invalid', actions: 'createGroup' },
        LOAD_GROUP: '.loading',
        SELECT_GROUP: { target: '.invalid', actions: 'assignSelectedGroup' },
        UPDATE_GROUP: { target: '.invalid', actions: 'assignGroupUpdates' },
        SAVE_GROUP: '.saving',
        SUBSCRIBE_GROUP_RESULT: { target: '.invalid', actions: 'assignSubscribeGroupResult' }
      }
    }
  },

  actions: {
    createGroup: assign({
      group: ({ group }, { data = {} }) => {
        if (group.subscription)
          group.subscription.stop();

        return { data }
      }
    }),

    assignSelectedGroup: assign({
      group: ({ group, apollo }, event) => {
        if (group.subscription)
          group.subscription.stop();

        let group$;
        if (event.group.id)
          group$ = apollo
            .subscribe({ query: SUBSCRIBE_GROUP, variables: { id: event.group.id } })
            .map(response => ({ type: 'SUBSCRIBE_GROUP_RESULT', data: response }));

        return {
          data: event.group,
          subscription: group$ ? spawn(group$) : undefined,
          error: undefined
        };
      }
    }),

    assignGroupUpdates: assign({
      group: ({ group }, event) => {
        const { color, description } = { ...group.data, ...event.data };
        const newData = { id: group.data.id || event.data.id, color, description };

        return { ...group, data: newData };
      }
    }),

    spawnGroupSubscription: assign({
      group: ({ group, apollo }, event) => {
        if (group.subscription)
          group.subscription.stop();

        const group$ = apollo
          .subscribe({ query: SUBSCRIBE_GROUP, variables: { id: event.id } })
          .map(response => ({ type: 'SUBSCRIBE_GROUP_RESULT', data: response }));

        return { ...group, subscription: spawn(group$) };
      }
    }),

    assignSubscribeGroupResult: assign({
      group: ({ group }, { data: result }) => {
        const data = result.data.groups[0] || {};
        return { ...group, data, error: undefined }
      }
    }),

    assignSaveGroupResult: assign({
      group: ({ group }, { data: result }) => {
        const { update_groups, insert_groups } = result.data;
        const data = update_groups ? update_groups.returning[0] : insert_groups.returning[0];

        return { ...group, data, error: null };
      }
    }),

    assignSaveGroupError: assign({
      group: ({ group }, { data: error }) => ({
        ...group,
        error
      })
    }),
  },

  services: {
    saveGroup: ({ group, apollo }, { data: eventData }) => {
      const {
        color,
        description
      } = { ...group.data, ...eventData };

      const dataIfUpdating = {
        id: group.data.id,
        color,
        description,
      };

      const dataIfCreating = {
        id: eventData.id || cuid(),
        color,
        description
      };

      return group.data.id
        ? apollo.mutate({ mutation: UPDATE_GROUP, variables: dataIfUpdating })
        : apollo.mutate({ mutation: CREATE_GROUP, variables: dataIfCreating });
    }
  },

  guards: {
    isGroupValid: ({ group }) => {
      const { description } = group.data;
      return Boolean(description);
    },

    isGroupSubscribed: ({ group }, event) => group.data.id === event.id && group.subscription,
  }
}