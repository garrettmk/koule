import React from 'react';
import { Modal } from "../../components";
import { TrashIcon } from "../../icons";
import * as S from './styled';
import { useMachineProvider } from "../../hooks";
import { State } from "../State";


export function TaskModal({ ...otherProps }) {
  const {
    state,
    send,
    task,
    error,
    groups,
  } = useMachineProvider(({ state, send, context }) => ({
    state,
    send,
    task: context.task.data,
    error: context.task.error,
    groups: context.groups.data,
    isLoading: state.matches('task.loading') || state.matches('task.saving'),
  }));

  const handleChangeGroup = event => {
    const { value } = event.target;
    const group = groups.find(group => group.id === value) || {};

    send({ type: 'SAVE_TASK', data: { group } });
  };

  const handleChangeDescription = description =>
    send({ type: 'SAVE_TASK', data: { description } });

  const handleSaveTask = () => send('SAVE_TASK');
  const handleStartTask = () => send('START_TASK');
  const handleFinishTask = () => send('FINISH_TASK');
  const handleCreateNewTask = () => send('CREATE_TASK');

  return (
    <Modal {...otherProps}>
      <S.Root>
        <S.Color color={task.group && task.group.color}/>

        <S.GroupSelect
          value={task.group ? task.group.id : null}
          onChange={handleChangeGroup}
        >
          <option value={null}>No Group</option>
          {groups.map(group => (
            <option key={group.id} value={group.id}>
              {group.description}
            </option>
          ))}
        </S.GroupSelect>

        <S.DescriptionInput
          placeholder={'Enter Description'}
          value={task.description || ''}
          onSubmit={handleChangeDescription}
        />

        <S.DeleteButton color={'error'}>
          <TrashIcon size={'small'}/>
        </S.DeleteButton>

        <State matches={'task.invalid'}>
          <S.ActionButton onClick={handleSaveTask}>
            Save
          </S.ActionButton>
        </State>
        <State matches={'task.ready'}>
          <S.ActionButton onClick={handleStartTask}>
            Start
          </S.ActionButton>
        </State>
        <State matches={'task.running'}>
          <S.ActionButton onClick={handleFinishTask}>
            Finish
          </S.ActionButton>
        </State>
        <State matches={'task.finished'}>
          <S.ActionButton onClick={handleCreateNewTask}>
            New Task
          </S.ActionButton>
        </State>
      </S.Root>
    </Modal>
  )
}