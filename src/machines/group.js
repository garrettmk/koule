import { Machine, assign, spawn, send } from 'xstate';
import { ApiMachine } from "./api";
import { GET_GROUP_BY_ID, UPDATE_GROUP, CREATE_GROUP } from "../queries";
import cuid from "cuid";
import {sendParent} from "xstate/es";


export const config = {
  id: 'group',
  context: {
    group: {},
  },
  initial: 'invalid',
  states: {
    invalid: {
      on: {
        '': [
          { cond: 'isValid', target: 'valid' }
        ]
      }
    },
    valid: {}
  },
  on: {
    EDIT: { cond: 'isAllowedEdit', actions: ['assignEdits', 'sendEdits'], target: 'invalid' },
    GET_GROUP: { actions: 'getGroup' },
    UPDATE_DATA: { target: 'invalid', actions: 'assignData' },
    CREATE_NEW: { target: 'invalid', actions: 'createGroup' }
  }
};

export const options = {
  actions: {
    assignEdits: assign({
      group: (ctx, { group }) => ({
        ...ctx.group,
        ...group
      })
    }),

    assignData: assign({
      group: (_, { group }) => group,
    }),

    sendEdits: sendParent(
      ({ group: { id, color, description } }) => ({ type: 'UPDATE_GROUP', group: { id, color, description } }),
    ),

    getGroup: send(
      (_, { id }) => ({ type: 'QUERY', query: GET_GROUP_BY_ID, variables: { id } } ),
      { to: 'group-api' }
    ),

    createGroup: send(
      () => ({ type: 'MUTATE', mutation: CREATE_GROUP, variables: { id: cuid() }}),
      { to: 'group-api' }
    ),
  },
  guards: {
    isValid: ({ group }) => group && group.id && group.description,
    isAllowedEdit: (_, { edits }) => true,
  }
};

export const GroupMachine = Machine(config, options);