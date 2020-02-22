import React, { useLayoutEffect, useRef, useState } from 'react';
import * as S from './styled';
import { TrashIcon } from "../../icons/Trash";
import { useMachineProvider } from "../../hooks";
import { State } from "../State";


export function TaskListItem({ task, mode, ...otherProps }) {
  const { send, groups } = useMachineProvider(({ state, send, context }) => ({
    send,
    groups: context.groups.data
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

  ///////////

  const editing = mode === 'edit';
  const disabled = mode !== 'edit';

  const innerRef = useRef(null);
  const groupSelectRef = useRef(null);
  const descriptionInputRef = useRef(null);

  const [viewHeight, setViewHeight] = useState();
  const [scrollTop, setScrollTop] = useState();

  useLayoutEffect(
    () => {
      const inner = innerRef.current;
      const description = descriptionInputRef.current;
      const group = groupSelectRef.current;

      if (!(inner && description && group))
        return;

      const innerStyle = window.getComputedStyle(innerRef.current);
      const innerHeight = inner.offsetHeight;
      const paddingTop = parseFloat(innerStyle.paddingTop);
      const gridGap = parseFloat(innerStyle.gridRowGap);

      const descriptionTop = description.offsetTop;
      const descriptionHeight = description.offsetHeight;
      const groupHeight = group.offsetHeight;

      if (mode === 'view') {
        setViewHeight(gridGap + descriptionHeight + gridGap);
        setScrollTop(descriptionTop - gridGap);
      }

      if (mode === 'viewWithGroup') {
        setViewHeight(paddingTop + groupHeight + gridGap + descriptionHeight + gridGap);
        setScrollTop(0);
      }

      if (mode === 'edit') {
        setViewHeight(innerHeight);
        setScrollTop(0);
      }
    },
    [mode]
  );

  return (
    <S.Root
      raised={editing}
      style={{
        height: viewHeight,
      }}
      {...otherProps}
    >
      <S.Inner
        ref={innerRef}
        style={{ top: -scrollTop }}
      >
        <S.Color color={task.group && task.group.color}/>

        <S.GroupSelect
          ref={groupSelectRef}
          disabled={disabled}
          value={task.group ? task.group.id : null}
          onChange={handleChangeGroup}
        >
          <option value={null}>No group</option>
          {groups.map(group => (
            <option key={group.id} value={group.id}>
              {group.description}
            </option>
          ))}
        </S.GroupSelect>

        <S.DescriptionInput
          ref={descriptionInputRef}
          disabled={disabled}
          placeholder={'Task description'}
          value={task.description}
          onSubmit={handleChangeDescription}
        />

        <S.DeleteButton>
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
      </S.Inner>
    </S.Root>
  );
}