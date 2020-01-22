import React from 'react';
import { useMachineProvider } from "../../hooks";
import { Header, List, Text, Collapse, Divider } from '../../components';
import { State} from "../../containers";
import * as S from './styled';


export function GroupsPage() {
  const { send, groups, error } = useMachineProvider(({ send, context }) => ({
    send,
    groups: context.groups.data,
    error: context.groups.error,
  }));

  return (
    <S.GroupsPage>
      <Header>Groups</Header>
      <State matches={'groups.loading'}>
        Loading...
      </State>
      <State matches={'groups.idle'}>
        <List>
          {groups.map(group => (
            <List.Item
              selected={true}
              color={group.color || 'gray'}
              style={{ marginTop: 1 }}
            >
              <Text.Subtitle>
                {group.description}
              </Text.Subtitle>
            </List.Item>
          ))}
        </List>
      </State>
    </S.GroupsPage>
  );
}