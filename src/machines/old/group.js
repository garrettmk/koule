import cuid from 'cuid';
import { assign, spawn } from "xstate";
import { CREATE_GROUP, SUBSCRIBE_GROUP, UPDATE_GROUP, UPSERT_GROUP } from "../../queries";

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
          }
        },
        valid: {},
        loading: {
          entry: 'spawnGroupSubscription',
          on: {
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
        SAVE_GROUP: { cond: 'isGroupWithUpdatesValid', target: '.saving' },
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
    saveGroup: ({ group, apollo }, event) => {
      const {
        id = cuid(),
        color,
        icon,
        description
      } = { ...group.data, ...event.data };

      const variables = { id, color, icon, description };

      return apollo.mutate({ mutation: UPSERT_GROUP, variables });
    }
  },

  guards: {
    isGroupValid: ({ group }) => {
      const { description } = group.data;
      return Boolean(description);
    },

    isGroupWithUpdatesValid: ({ group }, event) => {
      const { description } = { ...group.data, ...event.data };
      return Boolean(description);
    },

    isGroupSubscribed: ({ group }, event) => group.data.id === event.id && group.subscription,
  }
}