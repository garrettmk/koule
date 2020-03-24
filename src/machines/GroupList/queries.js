import gql from "graphql-tag";

const FRAGMENT_GROUP_FIELDS = gql`
  fragment GroupFields on groups {
    id
    color
    icon
    description
  }
`;

export const SUBSCRIBE_GROUP_LIST = gql`
  subscription subscribeGroups {
    groups {
      ...GroupFields
    }
  }

  ${FRAGMENT_GROUP_FIELDS}
`;

export const UPSERT_GROUP = gql`
  mutation upsertGroup(
    $id: String!
    $color: String
    $icon: String
    $description: String!
  ){
    insert_groups(
      objects: [{
        id: $id
        color: $color
        icon: $icon
        description: $description
      }]
      on_conflict: {
        constraint: groups_pkey
        update_columns: [color, icon, description]
      }
    ){
      returning {
        ...GroupFields
      }
    }
  }

  ${FRAGMENT_GROUP_FIELDS}
`;

export const UPDATE_GROUP = gql`
  mutation updateGroup(
    $id: String!
    $color: String
    $icon: String
    $description: String
  ){
    update_groups(
      where: {id: {_eq: $id}},
      _set: {
        color: $color,
        icon: $icon,
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
  mutation createGroup($id: String!, $color: String, $icon: String, $description: String!) {
    insert_groups(objects: {
      id: $id,
      color: $color,
      icon: $icon,
      description: $description
    }) {
      returning {
        ...GroupFields
      }
    }
  }

  ${FRAGMENT_GROUP_FIELDS}
`;