import { assign, Machine, sendParent } from "xstate";
import { UPDATE_TASK } from "./queries";

export const TaskMachine = Machine({
  id: 'task-machine',
  context: {},
  initial: 'initializing',
  states: {
    initializing: {
      on: {
        '': 'invalid',
      }
    },
    invalid: {
      on: {
        '': [
          { cond: 'isFinished', target: 'finished' },
          { cond: 'isRunning', target: 'running' },
          { cond: 'isReady', target: 'ready' }
        ]
      }
    },
    ready: {
      on: {
        START_TASK: {
          actions: ['assignStart', 'updateStart'],
          target: 'running'
        }
      }
    },
    running: {
      on: {
        FINISH_TASK: {
          actions: ['assignTaskEnd', 'updateEnd'],
          target: 'finished',
        }
      }
    },
    finished: {},
  },
  on: {
    SELECT_TASK: {
      actions: 'assignSelectedTask',
      target: 'invalid',
    },

    SET_TASK_DESCRIPTION: {
      cond: 'isValidDescriptionChange',
      actions: ['assignDescription', 'updateDescription'],
      target: 'invalid'
    },

    SET_TASK_GROUP_ID: {
      cond: 'isValidGroupIdChange',
      actions: ['assignGroupId', 'updateGroupId'],
    },

    SUBSCRIBE_TASK_LIST_RESULT: {
      actions: 'assignFromTaskListResult',
      target: 'invalid',
    },
  }
},{
  actions: {
    assignSelectedTask: assign((_, { task }) => {
      const { id, group_id, start, end, description } = task;
      return { id, group_id, start, end, description };
    }),

    assignDescription: assign({
      description: (_, { value }) => value,
    }),

    updateDescription: sendParent((task, { value: description }) => ({
      type: 'UPDATE_TASK',
      variables: { ...task, description }
    })),

    assignGroupId: assign({
      group_id: (_, { value }) => value,
    }),

    updateGroupId: sendParent((task, { value: group_id }) => ({
      type: 'UPDATE_TASK',
      variables: { ...task, group_id }
    })),

    assignStart: assign({
      start: new Date().toISOString(),
    }),

    updateStart: sendParent(task => ({
      type: 'UPDATE_TASK',
      variables: { ...task, start: new Date().toISOString() }
    })),

    assignEnd: assign({
      end: new Date().toISOString(),
    }),

    updateEnd: sendParent(task => ({
      type: 'UPDATE_TASK',
      variables: { ...task, end: new Date().toISOString() },
    })),

    assignFromTaskListResult: assign((current, event) => {
      const task = event.data.data.tasks.find(task => task.id === current.id);
      if (task)
        delete task.__typename;

      return task;
    }),
  },

  guards: {
    isFinished: ({ end }) => end,
    isRunning: ({ start }) => start,
    isReady: ({ description }) => description,
    isValidDescriptionChange: ({ description }, { value }) =>
      typeof value === 'string' &&
      value.length &&
      value !== description,

    isValidGroupIdChange: ({ group_id }, { value }) => value !== group_id,
  }
});