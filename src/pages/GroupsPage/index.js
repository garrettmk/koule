import React, { Fragment } from 'react';
import { useMachineProvider } from "../../hooks";
import { Header, List } from '../../components';
import { State } from "../../containers";
import * as S from './styled';
import { GroupItem } from "./GroupItem";


export function GroupsPage() {
  const { send, groups, selectedGroup, error } = useMachineProvider(({ send, context }) => ({
    send,
    groups: context.groups.data,
    error: context.groups.error,
    selectedGroup: context.group.data,
  }));

  const handleSelectGroup = group => send({ type: 'SELECT_GROUP', group });
  const handleUpdateGroup = updates => send({ type: 'SAVE_GROUP', data: updates });

  return (
    <S.GroupsPage>
      <Header>Groups</Header>
      <State matches={'groups.loading'}>
        Loading...
      </State>
      <State matches={'groups.idle'}>
        <List>
          {groups.map((group, index) => (
            <Fragment>
              <GroupItem
                group={group}
                selected={selectedGroup.id === group.id}
                onSelect={handleSelectGroup}
                onUpdate={handleUpdateGroup}
              />
              {index < groups.length - 1 && (
                <S.Divider/>
              )}
            </Fragment>
          ))}
        </List>
      </State>
    </S.GroupsPage>
  );
}