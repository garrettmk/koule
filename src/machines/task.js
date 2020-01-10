import {assign, Machine, sendParent} from "xstate";
import {UPDATE_TASK} from "../queries";


export const config = {
  id: 'task',
  context: {
    task: {},
  },
  initial: 'invalid',
  states: {
    invalid: {
      on: {
        '': [
          { cond: 'isFinished', target: 'finished' },
          { cond: 'isRunning', target: 'running' },
          { cond: 'isReady', target: 'ready' },
        ]
      }
    },
    ready: {
      on: {
        START: { target: 'running', actions: ['assignStart', 'sendEdits'] }
      }
    },
    running: {
      on: {
        FINISH: { target: 'finished', actions: ['assignEnd', 'sendEdits'] }
      }
    },
    finished: {}
  },
  on: {
    EDIT: { cond: 'isAllowedEdit', actions: ['assignEdits', 'sendEdits'], target: 'invalid' },
    GET_TASK: { actions: 'getTask' },
    UPDATE_DATA: { target: 'invalid', actions: 'assignData' },
    FINISH_AND_NEW: { cond: 'isFinishAllowed', target: 'invalid', actions: ['assignEnd', 'sendEdits', 'createTask'] }
  }
};

export const options = {
  actions: {
    isAllowedEdit: () => true,

    assignEdits: assign({
      task: (ctx, { task }) => ({
        ...ctx.task,
        ...task
      })
    }),

    assignData: assign({
      task: (_, {task}) => task,
    }),

    assignStart: assign({
      task: ctx => ({ ...ctx.task, start: new Date().toISOString() }),
    }),

    assignEnd: assign({
      task: ctx => ({ ...ctx.task, end: ctx.task.end || new Date().toISOString() }),
    }),

    sendEdits: sendParent(
      ({ task: { id, start, end, group_id, description } }) => ({ type: 'UPDATE_TASK', task: { id, start, end, group_id, description } }),
    ),
  },
  guards: {
    isFinished: ({ task: { id, group_id, description, start, end } = {} }) => id && description && start && end,
    isRunning: ({ task: { id, group_id, description, start } = {} }) => id && description && start,
    isReady: ({ task: { id, group_id, description } = {} }) => id && description,
    isAllowedEdit: () => true,
    isFinishAllowed: ({ task: { id, description, start } }) => id && description && start,
  }
};

export const TaskMachine = Machine(config, options);