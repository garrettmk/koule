import React from 'react';
import { Header, TextInput } from '../../components';
import * as S from './styled';
import { State } from "../../containers/State";
import { useMachineProvider } from "../../hooks";

export function TaskPage() {
  const { send, task, error } = useMachineProvider(({ send, context }) => ({
    send,
    task: context.task.data,
    error: context.task.error,
  }));

  return (
    <S.TaskPage>
      <Header>Current Task</Header>
      <State matches={'task.loading'}>
        Loading...
      </State>
      <State matches={'task.error'}>
        Error
      </State>
      <State matches={'task.saving'}>
        Saving...
      </State>
      <State matches={['task.invalid', 'task.ready', 'task.running', 'task.finished', 'task.saving']}>
        <ul>
          <li>
            Description:{' '}
            <TextInput
              value={task.description}
              onSubmit={description => {
                send({ type: 'UPDATE_TASK', data: { description } });
                send('SAVE_TASK');
              }}
            />
          </li>
          <li>Start: {task.start}</li>
          <li>End: {task.end}</li>
          <li>
            Status:{' '}
            <State matches={'task.invalid'}>
              Invalid
            </State>
            <State matches={'task.ready'}>
              Ready
            </State>
            <State matches={'task.running'}>
              Running
            </State>
            <State matches={'task.finished'}>
              Finished
            </State>
          </li>
          <State matches={'task.ready'}>
            <button onClick={() => send('START_TASK')}>Start</button>
          </State>
          <State matches={'task.running'}>
            <button onClick={() => send('FINISH_TASK')}>Finish</button>
          </State>
          <State matches={'task.finished'}>
            <button onClick={() => send('CREATE_TASK')}>New Task</button>
          </State>
        </ul>
      </State>
    </S.TaskPage>  );
}