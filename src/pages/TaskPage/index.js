import React from 'react';
import { SectionDivider, TextInput, Button } from "../../atoms";
import { TaskDuration } from "./components";
import { State } from "../../containers/";
import { useMachineProvider } from "../../hooks";
import * as S from './styled';
import * as icons from '../../icons';
import cuid from "cuid";


export function TaskPage(props) {
  const { state, send, task, groups } = useMachineProvider(({ state, send, context }) => ({
    state,
    send,
    task: context.task.data,
    groups: context.groups.data,
  }));

  const updateDescription = description => send({ type: 'SAVE_TASK', data: { description } });
  const updateGroup = description => {
    if (!description)
      return send({ type: 'SAVE_TASK', data: { group_id: null } });

    // Try to find an existing group first
    const existingGroup = groups.find(group => group.description.toLowerCase() === description.toLowerCase());
    if (existingGroup)
      return send({ type: 'SAVE_TASK', data: { group_id: existingGroup.id } });

    // Create a new group
    const id = cuid();
    send({ type: 'SAVE_GROUP', data: { id, description } });
    send({ type: 'SAVE_TASK', data: { group_id: id } });
  };

  const navigateChooseIcon = () => send('NAVIGATE_CHOOSE_ICON');
  const [label, action] =
    state.matches('task.ready') ? ['Start', 'START_TASK'] :
    state.matches('task.running') ? ['Finish', 'FINISH_TASK'] :
    state.matches('task.finished') ? ['New', 'LOAD_TASK'] :
    ['Please wait', null];

  const { start, end, description, group } = task;

  return (
    <S.TaskPage {...props}>
      <TaskDuration
        start={start}
        end={end}
      />

      <S.Section>
        Activity
      </S.Section>
      <S.ActivityFrame>
        <Button outlined disabled={!group} onClick={navigateChooseIcon}>
          {(() => {
            const name = group && group.icon;
            const component = icons[name] || icons['QuestionIcon'];
            return React.createElement(component);
          })()}
        </Button>
        <TextInput
          disabled={!task.id}
          placeholder={'Activity Name'}
          value={group ? group.description : ''}
          onSubmit={updateGroup}
          list={'group-names-list'}
        />
        <datalist id={'group-names-list'}>
          {groups.map(group => (
            <option key={group.id} value={group.description}>
              {group.description}
            </option>
          ))}
        </datalist>
      </S.ActivityFrame>

      <S.Section>
        Description
      </S.Section>
      <TextInput
        value={description}
        onSubmit={updateDescription}
      />

      <State not matches={'task.invalid'}>
        <S.ActionButton disabled={!action} onClick={() => send(action)}>
          {label}
        </S.ActionButton>
      </State>
    </S.TaskPage>
  );
}