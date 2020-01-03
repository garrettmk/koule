import { Machine, assign, sendParent, spawn, send } from "xstate";
import { ApiMachine } from "./api";
import { UPDATE_TASK, GET_TASK_BY_ID, GET_CURRENT_TASK, CREATE_TASK } from "../queries";
import cuid from "cuid";


export const config = {
  id: 'task',
  context: {
    task: {},
    api: undefined
  },
  initial: 'invalid',
  states: {
    invalid: {
      entry: 'createTaskApi',
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

    createTaskApi: assign({
      api: ctx => ctx.api || spawn(
        ApiMachine.withContext({ query: GET_CURRENT_TASK, mutation: UPDATE_TASK }), 'update-api'),
    }),

    assignEdits: assign({
      task: (ctx, { edits }) => ({
        ...ctx.task,
        ...edits
      })
    }),

    assignData: assign({
      task: (_, { data }) => {
        if (data.tasks)
          return data.tasks[0];
        if (data.update_tasks)
          return data.update_tasks.returning[0];
        if (data.insert_tasks)
          return data.insert_tasks.returning[0];
      }
    }),

    assignStart: assign({
      task: ctx => ({ ...ctx.task, start: new Date().toISOString() }),
    }),

    assignEnd: assign({
      task: ctx => ({ ...ctx.task, end: ctx.task.end || new Date().toISOString() }),
    }),

    sendEdits: send(
      ({ task: { id, start, end, group_id, description } }) => ({ type: 'MUTATE', variables: { id, start, end, group_id, description } }),
      { to: 'update-api' }
    ),

    getTask: send(
      (_, { id }) => id
        ? { type: 'QUERY', query: GET_TASK_BY_ID, variables: { id } }
        : { type: 'QUERY', query: GET_CURRENT_TASK },
      { to: 'update-api' }
    ),

    createTask: send(
      () => ({ type: 'MUTATE', mutation: CREATE_TASK, variables: { id: cuid() } }),
      { to: 'update-api' }
    )
  },
  guards: {
    isFinished: ({ task: { id, group_id, description, start, end } }) => id && description && start && end,
    isRunning: ({ task: { id, group_id, description, start } }) => id && description && start,
    isReady: ({ task: { id, group_id, description }}) => id && description,
    isAllowedEdit: () => true,
    isFinishAllowed: ({ task: { id, description, start } }) => id && description && start,
  }
};

export const TaskMachine = Machine(config, options);