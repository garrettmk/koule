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
      entry: ['registerApiOperations', 'subscribeGroupList'],
      on: {
        '': 'ready'
      }
    },
    ready: {}
  },
  on: {
    SUBSCRIBE_GROUP_LIST_RESULT: {
      actions: 'assignSubscribeResult'
    }
  }
},{
  actions: {
    registerApiOperations: sendParent({
      type: 'REGISTER_API_OPERATIONS',
      operations: {
        SUBSCRIBE_GROUP_LIST: {
          body: SUBSCRIBE_GROUP_LIST,
          successEvent: 'SUBSCRIBE_GROUP_LIST_RESULT',
          errorEvent: 'SUBSCRIBE_GROUP_LIST_ERROR',
          cancelEvent: 'SUBSCRIBE_GROUP_LIST_CANCEL'
        },
        CREATE_GROUP: {
          body: CREATE_GROUP,
          successEvent: 'CREATE_GROUP_RESULT',
          errorEvent: 'CREATE_GROUP_ERROR',
          excludeFromCache: true,
        },
        UPDATE_GROUP: {
          body: UPDATE_GROUP,
          successEvent: 'UPDATE_GROUP_RESULT',
          errorEvent: 'UPDATE_GROUP_ERROR',
          excludeFromCache: true,
        }
      }
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