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