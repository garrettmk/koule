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

const FRAGMENT_GROUP_FIELDS = gql`
  fragment GroupFields on groups {
    id
    color
    icon
    description
  }
`;

export const SUBSCRIBE_TASK_BY_ID = gql`
  subscription subscribeTaskById($id: String!) {
    tasks(where: { id: { _eq: $id } }) {
      ...TaskFields
    }
  }

  ${FRAGMENT_TASK_FIELDS}
`;

export const SUBSCRIBE_CURRENT_TASK = gql`
  subscription subscribeCurrentTask {
    tasks(
      where: {
        start: { is_null: true }
      }
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