import React from 'react';
import { useMachineProvider } from "../../hooks";
import { List, Text, Button } from '../../components';
import { BackButton, PageHeader, State } from "../../containers";
import * as S from './styled';


export function GroupsPage() {
  const { send, groups, error } = useMachineProvider(({ send, context }) => ({
    send,
    groups: context.groups.data,
    error: context.groups.error,
    selectedGroup: context.group.data,
  }));

  const handleGroupClick = group => send({
    type: 'NAVIGATE_GROUP',
    id: group.id,
  });

  const handleCreateGroup = () => send('NAVIGATE_GROUP');

  return (
    <S.Page>
      <PageHeader>
        <PageHeader.Navigation>
          <BackButton/>
        </PageHeader.Navigation>
        <PageHeader.Title>
          Groups
        </PageHeader.Title>
      </PageHeader>

      <State matches={'groups.loading'}>
        Loading...
      </State>
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