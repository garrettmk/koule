import gql from 'graphql-tag';

export const GET_TASKS_BY_DATE = gql`
  query getTasks($after: timestamptz!, $before: timestamptz!) {
    tasks(
      where: {
        _and: [
          { start: { _gte: $after } },
          { start: { _lte: $before } },
        ]
      }, 
      order_by: { start: asc }
    ) {
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
  }
`;

export const GET_TASK_COUNT_BY_DATE = gql`
  query getTaskCountByDate {
    task_count_by_date {
      count
      date
    }
  }
`;

export const GET_CURRENT_TASK = gql`
  query getCurrentTask {
    tasks(where: {end: {_is_null: true}}, limit: 1) {
      id
      group_id
      group {
        id
        description
        color
      }
      start
      end
      description
    }
  }
`;

export const GET_TASK_BY_ID = gql`
  query getTaskById($id: String!) {
    tasks(where: { id: { _eq: $id } }) {
      id
      group_id,
      group {
        id
        description
        color
      }
      start
      end
      description
    }
  }
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
        id
        group_id
        start
        end
        description
      }
    }
  }
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
        id
        group_id
        group {
          id
          description
          color
        }
        start
        description
      }
    }
  }
`;

export const GET_GROUPS = gql`
    query getGroups {
        groups {
            id
            description
            color
        }
    }
`;

export const GET_GROUP_BY_ID = gql`
    query getGroupById($id: String!) {
        groups(where: { id: { _eq: $id } }) {
            id
            color
            description
        }
    }
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
                id
                color
                description
            }
        }
    }
`;

export const CREATE_GROUP = gql`
    mutation createGroup($id: String!, $color: String, $description: String!) {
        insert_groups(objects: {
            id: $id,
            color: $color,
            description: $description
        }) {
            returning {
                id
                color
                description
            }
        }
    }
`;