import React from 'react';
import { useMachineProvider } from "../../hooks";
import { Button, List, Text } from '../../components';
import { State, PageHeader } from "../../containers";
import * as S from './styled';


export function GroupsPage() {
  const { send, groups, error, isLoading } = useMachineProvider(({ state, send, context }) => ({
    send,
    groups: context.groups.data,
    error: context.groups.error,
    selectedGroup: context.group.data,
    isLoading: state.matches('groups.loading'),
  }));

  const handleGroupClick = group => send({
    type: 'NAVIGATE_GROUP',
    id: group.id,
  });

  const handleCreateGroup = () => send('NAVIGATE_GROUP');

  return (
    <S.Page>
      <PageHeader
        title={'Groups'}
        loading={isLoading}
      />
      <State matches={'groups.error'}>
        Error: {error}
      </State>
      <List>
        {groups.map(group => (
          <List.Item key={group.id} onClick={() => handleGroupClick(group)}>
            <List.Color color={group.color}/>
            <Text.Body>
              {group.description}
            </Text.Body>
            <List.Divider/>
          </List.Item>
        ))}
      </List>
      <Button color={'blue'} onClick={handleCreateGroup}>
        New
      </Button>
    </S.Page>
  );
}