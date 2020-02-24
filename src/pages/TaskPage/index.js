import React, { Fragment, useState } from 'react';
import { Button, TaskDuration, TextInput, Select } from '../../components';
import * as S from './styled';
import { State } from "../../containers";
import { useMachineProvider } from "../../hooks";

export function TaskPage() {
  const { send, task, error, groups, isLoading } = useMachineProvider(({ state, send, context }) => ({
    send,
    task: context.task.data,
    error: context.task.error,
    groups: context.groups.data,
    isLoading: state.matches('task.loading') || state.matches('task.saving'),
  }));

  const handleChangeDescription = description =>
    send({ type: 'SAVE_TASK', data: { description } });

  const handleChangeGroup = event => {
    const { value } = event.target;
    const group = groups.find(group => group.id === value) || {};

    send({ type: 'SAVE_TASK', data: { group } });
  };

  const handleStartTask = () => send('START_TASK');
  const handleFinishTask = () => send('FINISH_TASK');
  const handleNewTask = () => send('CREATE_TASK');

  return (
    <S.Page>
      <S.PageHeader
        title={'Task'}
        loading={isLoading}
      />

      <State matches={'task.error'}>
        <S.StatusMessage>
          Error: {error}
        </S.StatusMessage>
      </State>

      <State matches={['task.invalid', 'task.ready', 'task.running', 'task.finished', 'task.saving']}>

        <S.DurationContainer>
          <S.Duration>
            {task.start ? (
              <TaskDuration start={task.start} end={task.end}/>
            ) : (
              '--:--'
            )}
          </S.Duration>
        </S.DurationContainer>

        <S.Section>
          Group
        </S.Section>
        <S.GroupContainer>
          <Select value={task.group ? task.group.id : null} onChange={handleChangeGroup}>
            <option value={null}>No group</option>
            {groups.map(group => (
              <option
                key={group.id}
                value={group.id}
              >
                {group.description}
              </option>
            ))}
          </Select>
          <Button color={'blue'} onClick={() => send('NAVIGATE_GROUP')}>
            New Group
          </Button>
        </S.GroupContainer>

        <S.Section>
          Description
        </S.Section>
        <TextInput
          placeholder={'Enter description'}
          value={task.description}
          onSubmit={handleChangeDescription}
        />

        <State matches={'task.ready'}>
          <S.ActionButton onClick={handleStartTask}>
            Start Task
          </S.ActionButton>
        </State>
        <State matches={'task.running'}>
          <S.ActionButton onClick={handleFinishTask}>
            Finish Task
          </S.ActionButton>
        </State>
        <State matches={'task.finished'}>
          <S.ActionButton onClick={handleNewTask}>
            New Task
          </S.ActionButton>
        </State>
      </State>
    </S.Page>
  );
}