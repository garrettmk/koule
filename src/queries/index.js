import gql from 'graphql-tag';

const FRAGMENT_TASK_FIELDS = gql`
  fragment TaskFields on tasks {
    id
    group_id
    group {
      id
      color
      description
    }
    start
    end
    description
  }
`;

const FRAGMENT_GROUP_FIELDS = gql`
  fragment GroupFields on groups {
    id
    color
    description
  }
`;

export const SUBSCRIBE_TASKS = gql`
  subscription subscribeTaskList {
    tasks {
      ...TaskFields
    }
  }
  
  ${FRAGMENT_TASK_FIELDS}
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

export const SUBSCRIBE_CALENDAR = gql`
  query getTaskCountByDate {
    task_count_by_date {
      count
      date
    }
  }
`;

export const SUBSCRIBE_CURRENT_TASK = gql`
  subscription subscribeCurrentTask {
    tasks(where: {end: {_is_null: true}}, limit: 1) {
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

export const SUBSCRIBE_GROUP_LIST = gql`
  subscription subscribeGroups {
    groups {
      ...GroupFields
    }
  }
  
  ${FRAGMENT_GROUP_FIELDS}
`;

export const SUBSCRIBE_GROUP = gql`
  subscription subscribeGroup($id: String!) {
    groups(where: { id: { _eq: $id } }) {
      ...GroupFields
    }
  }
  
  ${FRAGMENT_GROUP_FIELDS}
`;

export const UPDATE_GROUP = gql`
  mutation updateGroup(
    $id: String!,
    $color: String
    $description: String
  ){
    update_groups(
      where: {id: {_eq: $id}},
      _set: {
        color: $color,
        description: $description
      }
    ) {
      returning {
        ...GroupFields
      }
    }
  }
  
  ${FRAGMENT_GROUP_FIELDS}
`;

export const CREATE_GROUP = gql`
  mutation createGroup($id: String!, $color: String, $description: String!) {
    insert_groups(objects: {
      id: $id,
      color: $color,
      description: $description
    }) {
      returning {
        ...GroupFields
      }
    }
  }
  
  ${FRAGMENT_GROUP_FIELDS}
`;