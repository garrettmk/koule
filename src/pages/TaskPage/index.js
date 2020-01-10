import React, {useEffect} from 'react';
import {useMachineProvider} from "../../hooks";
import State from "../../containers/State";
import TextInput from "../../components/TextInput";
import Navigation from "../../components/Navigation";

export default function TaskPage() {
  const { send, task, error, groups } = useMachineProvider(({ context, send }) => ({
    send,
    task: context.task.data,
    error: context.task.error,
    groups: context.groupList.data,
  }));

  return (
    <div>
      <Navigation/>
      <div>
        <State matches={'task.loading'}>
          Loading...
        </State>
        <State matches={'task.saving'}>
          Saving...
        </State>
        <State matches={'task.error'}>
          {error}
        </State>
        <State matches={['task.invalid', 'task.ready', 'task.running', 'task.finished', 'task.saving']}>
          <ul>
            <li>
              Group:
              <select
                value={task.group ? task.group.id : null}
                onChange={event => send({ type: 'UPDATE_TASK', task: { group_id: event.target.value }})}
              >
                {groups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.description}
                  </option>
                ))}
              </select>
              <button onClick={() => { send('CREATE_GROUP'); send('NAVIGATE_GROUP') }}>New</button>
            </li>
            <li>
              Start: {task.start}
            </li>
            <li>
              End: {task.end}
            </li>
            <li>
              Description:
              <TextInput
                value={task.description}
                onSubmit={newValue => send({
                  type: 'UPDATE_TASK',
                  task: { description: newValue }
                })}
              />
            </li>
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
          </ul>
          <State matches={'task.ready'}>
            <button onClick={() => send('START_TASK')}>Start</button>
          </State>
          <State matches={'task.running'}>
            <button onClick={() => send('FINISH_TASK')}>Finish</button>
          </State>
          <State matches={'task.finished'}>
            <button onClick={() => send('CREATE_TASK')}>New Task</button>
          </State>
        </State>
      </div>
    </div>
  );
}