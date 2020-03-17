import { Machine, sendParent, assign } from "xstate";
import { QUERY_TASKS_BY_DATE } from "../../queries";

export const TasksMachine = Machine({
  id: 'tasks-machine',
  context: {
    tasks: [],
    afterDate: new Date(0),
  },
  initial: 'unavailable',
  states: {
    unavailable: {
      entry: 'queryTasks',
      on: {
        QUERY_TASKS_RESULT: { actions: 'assignQueryResult', target: 'available' }
      }
    },
    available: {}
  }
},{
  actions: {
    queryTasks: sendParent(context => ({
      type: 'QUERY',
      id: 'TASKS',
      query: QUERY_TASKS_BY_DATE,
      variables: {
        after: context.afterDate.toISOString(),
        before: null
      }
    })),

    assignQueryResult: assign({
      tasks: (_, { data }) => data,
    })
  }
});