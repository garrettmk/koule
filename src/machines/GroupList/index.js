import { Machine, assign, sendParent, send } from "xstate";
import { CREATE_GROUP, SUBSCRIBE_GROUP_LIST, UPDATE_GROUP } from "./queries";

export const GroupListMachine = Machine({
  id: 'group-list-machine',
  context: {
    groupList: []
  },
  initial: 'ready',
  states: {
    initializing: {
      on: {
        SUBSCRIBE_GROUP_LIST_RESULT: {
          actions: 'assignSubscribeResult',
          target: 'ready'
        }
      }
    },
    ready: {}
  },
  on: {
    API_READY: {
      actions: ['registerApiOperations', 'subscribeGroupList'],
    },

    SUBSCRIBE_GROUP_LIST_RESULT: {
      actions: 'assignSubscribeResult'
    }
  }
},{
  actions: {
    registerApiOperations: sendParent({
      type: 'REGISTER_API_OPERATIONS',
      operations: [
        {
          subscription: SUBSCRIBE_GROUP_LIST,
          subscribeEvent: 'SUBSCRIBE_GROUP_LIST',
          successEvent: 'SUBSCRIBE_GROUP_LIST_RESULT',
          errorEvent: 'SUBSCRIBE_GROUP_LIST_ERROR',
          cancelEvent: 'SUBSCRIBE_GROUP_LIST_CANCEL'
        },
        {
          mutation: CREATE_GROUP,
          mutateEvent: 'CREATE_GROUP',
          successEvent: 'CREATE_GROUP_RESULT',
          errorEvent: 'CREATE_GROUP_ERROR'
        },
        {
          mutation: UPDATE_GROUP,
          mutateEvent: 'UPDATE_GROUP',
          successEvent: 'UPDATE_GROUP_RESULT',
          errorEvent: 'UPDATE_GROUP_ERROR'
        }
      ]
    }),

    subscribeGroupList: sendParent({
      type: 'SUBSCRIBE_GROUP_LIST',
    }),

    unsubscribeGroupList: sendParent({
      type: 'SUBSCRIBE_GROUP_LIST_CANCEL'
    }),

    assignSubscribeResult: assign({
      groupList: (_, { data }) => data.data.groups || []
    }),
  }
});