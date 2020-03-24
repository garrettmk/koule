import gql from "graphql-tag";

const FRAGMENT_TASK_FIELDS = gql`
  fragment TaskFields on tasks {
    id
    group_id
    start
    end
    description
  }
`;

// Note that $before is nullable. This is would include the current task, which
// may have a null start value
export const SUBSCRIBE_TASKS_BY_DATE = gql`
  subscription subscribeTasks($after: timestamptz!, $before: timestamptz) {
    tasks(
      where: {
        _or: [
          {
            _and: [
              { start: { _gte: $after } },
              { start: { _lte: $before } },
            ]
          },
          {
            start: { _eq: $before },
          }
        ],
      },
      order_by: { start: asc }
    ) {
      ...TaskFields
    }
  }

  ${FRAGMENT_TASK_FIELDS}
`;

export const SUBSCRIBE_TASK_BY_ID = gql`
  subscription subscribeTaskById($id: String!) {    
    tasks(where: { id: { _eq: $id } }) {
      ...TaskFields
    }
  }

  ${FRAGMENT_TASK_FIELDS}
`;

export const SUBSCRIBE_TASKS = gql`
  subscription subscribeTasks {
    tasks(
      order_by: { start: asc }
    ) {
      ...TaskFields
    }
  }
  
  ${FRAGMENT_TASK_FIELDS}
`;

export const UPDATE_TASK = gql`
  mutation updateTask(
    $id: String!,
    $group_id: String,
    $start: timestamptz,
    $end: timestamptz,
    $description: String
  ){
    update_tasks(
      where: {id: {_eq: $id}},
      _set: {
        group_id: $group_id,
        start: $start,
        end: $end,
        description: $description
      }
    ) {
      returning {
        ...TaskFields
      }
    }
  }

  ${FRAGMENT_TASK_FIELDS}
`;

export const UPSERT_TASK = gql`
  mutation upsertTask(
    $id: String!,
    $group_id: String,
    $start: timestamptz,
    $end: timestamptz,
    $description: String,    
  ) {
    insert_tasks(
      objects: [{
        id: $id
        group_id: $group_id
        start: $start
        end: $end
        description: $description
      }]
      on_conflict: {
        constraint: tasks_pkey
        update_columns: [group_id, start, end, description]
      }
    ) {
      returning {
        ...TaskFields
      }
    }
  }
  
  ${FRAGMENT_TASK_FIELDS}
`;

export const CREATE_TASK = gql`
  mutation createTask($id: String!, $group_id: String, $start: timestamptz, $description: String) {
    insert_tasks(objects: {
      id: $id,
      group_id: $group_id,
      start: $start,
      description: $description,
    }) {
      returning {
        ...TaskFields
      }
    }
  }

  ${FRAGMENT_TASK_FIELDS}
`;