import React from 'react';
import { TextInput, Button, SectionDivider } from "../../atoms";
import { TaskDuration } from "./components";
import { State } from "../../containers/";
import { useMachineProvider } from "../../hooks";
import * as S from './styled';
import * as icons from '../../icons';
import cuid from "cuid";
import { useTrail, useSpring, animated } from "react-spring";


export function TaskPage(props) {
  const { taskList, task, groupList, send } = useMachineProvider();
  const groups = groupList.context.groupList;
  const tasks = taskList.context.tasks;

  const { id, group_id, description, start, end } = task.context;
  const group = groups.find(g => g.id === group_id);

  const setDescription = description => send({ type: 'SET_TASK_DESCRIPTION', value: description });
  const setGroupId = groupId => send({ type: 'SET_TASK_GROUP_ID', value: groupId });
  const createGroup = ({ id, description }) => send({ type: 'CREATE_GROUP', variables: { id, description }});

  const updateGroup = description => {
    if (!description)
      return setGroupId(null);

    // Try to find an existing group first
    const existingGroup = groups.find(group => group.description.toLowerCase() === description.toLowerCase());
    if (existingGroup)
      return setGroupId(existingGroup.id);

    // Create a new group
    const id = cuid();
    createGroup({ id, description });
    setGroupId(id);
  };

  const isLastTask = tasks.length && id === tasks[tasks.length - 1].id;
  const navigateChooseIcon = () => send('NAVIGATE_CHOOSE_ICON');
  const startTask = () => send('START_TASK');
  const finishTask = () => send('FINISH_TASK');
  const newTask = () => send('CREATE_TASK');
  const nextTask = () => {
    const index = tasks.findIndex(t => t.id === id);
    const nextId = tasks[index + 1].id;
    send({ type: 'NAVIGATE_TASK', id: nextId });
  };

  const [label, action] =
    task.matches('ready') ? ['Start', startTask] :
    task.matches('running') ? ['Finish', finishTask] :
    task.matches('finished') && isLastTask ? ['New Task', newTask] :
    task.matches('finished') ? ['Next', nextTask] :
    ['Please wait', null];

  // Animations

  const actionHolderProps = useSpring({
    height: task.matches('invalid') ? 0 : 48,
    overflow: 'hidden',
    margin: '24px 0'
  });

  return (
    <S.TaskPage {...props}>
      <TaskDuration
        start={start}
        end={end}
      />

      <S.SectionHeader>Description</S.SectionHeader>
      <S.DescriptionInput
        value={description}
        onSubmit={setDescription}
      />

      <S.SectionHeader>Activity</S.SectionHeader>
      <S.ActivityFrame>
        <Button outlined disabled={!group} onClick={navigateChooseIcon}>
          {(() => {
            const name = group && group.icon;
            const component = icons[name] || icons['QuestionIcon'];
            return React.createElement(component);
          })()}
        </Button>
        <TextInput
          disabled={!id}
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

      <animated.div style={actionHolderProps}>
        <S.ActionButton disabled={!action} onClick={action}>
          {label}
        </S.ActionButton>
      </animated.div>
    </S.TaskPage>
  );
}