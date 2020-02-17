import React from 'react';
import { ColorSelector, TextInput } from "../../components";
import * as S from './styled';
import { BackButton, PageHeader, State } from "../../containers";
import { useMachineProvider } from "../../hooks";


export function GroupPage() {
  const { send, group, error } = useMachineProvider(({ send, context }) => ({
    send,
    group: context.group.data,
    error: context.group.error,
  }));

  return (
    <S.GroupPage>
      <PageHeader>
        <PageHeader.Navigation>
          <BackButton/>
        </PageHeader.Navigation>
        <PageHeader.Title>
          {group.id ? 'Edit Group' : 'Create Group'}
        </PageHeader.Title>
      </PageHeader>

      <State matches={'group.loading'}>
        Loading...
      </State>
      <State matches={'group.error'}>
        Error: {error}
      </State>
      <State matches={'group.saving'}>
        Saving...
      </State>

      <ul>
        <li>
          Description:
          <TextInput
            value={group.description}
            onSubmit={description => send({
              type: 'SAVE_GROUP',
              data: { description }
            })}
          />
        </li>
        <li>
          Color:
          <ColorSelector
            onChange={color => send({
              type: 'SAVE_GROUP',
              data: { color }
            })}
          />
        </li>
      </ul>
    </S.GroupPage>
  )
}