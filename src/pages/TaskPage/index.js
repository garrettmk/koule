import React from 'react';
import { SectionDivider, TextInput, Button } from "../../atoms";
import { TaskDuration } from "./components";
import { useMachineProvider } from "../../hooks";
import * as S from './styled';
import { QuestionIcon } from "../../icons/Question";


export function TaskPage(props) {
  const { send, task, groups } = useMachineProvider(({ send, context }) => ({
    send,
    task: context.task.data,
    groups: context.groups.data,
  }));

  const updateDescription = description => send({ type: 'SAVE_TASK', data: { description } });

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
        <Button outlined disabled={!group}>
          <QuestionIcon/>
        </Button>
        <TextInput
          placeholder={'Activity Name'}
          value={group ? group.description : ''}
          list={'group-names-list'}
        />
        <datalist id={'group-names-list'}>
          {groups.map(group => (
            <option key={group.id} value={group.description}/>
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
    </S.TaskPage>
  );
}