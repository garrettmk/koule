import { Machine, assign, sendParent, send } from "xstate";
import { CREATE_GROUP, SUBSCRIBE_GROUP_LIST, UPDATE_GROUP } from "./queries";

export const GroupListMachine = Machine({
  id: 'group-list-machine',
  context: {
    groupList: []
  },
  initial: 'initializing',
  states: {
    initializing: {
      entry: 'registerApiOperations',
      on: {
        '': 'ready'
      }
    },
    ready: {}
  },
  on: {
    API_READY: {
      actions: 'subscribeGroupList',
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
          body: SUBSCRIBE_GROUP_LIST,
          sendEvent: 'SUBSCRIBE_GROUP_LIST',
          successEvent: 'SUBSCRIBE_GROUP_LIST_RESULT',
          errorEvent: 'SUBSCRIBE_GROUP_LIST_ERROR',
          cancelEvent: 'SUBSCRIBE_GROUP_LIST_CANCEL'
        },
        {
          body: CREATE_GROUP,
          sendEvent: 'CREATE_GROUP',
          successEvent: 'CREATE_GROUP_RESULT',
          errorEvent: 'CREATE_GROUP_ERROR'
        },
        {
          body: UPDATE_GROUP,
          sendEvent: 'UPDATE_GROUP',
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