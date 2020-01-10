import React from 'react';
import {useMachineProvider} from "../../hooks";
import State from "../../containers/State";
import Navigation from "../../components/Navigation";

export default function DayPage() {
  const { tasks, error, send } = useMachineProvider(({ send, context }) => ({
    tasks: context.day.data,
    error: context.day.error,
    send,
  }));

  return (
    <div>
      <Navigation/>
      <div>
        <State matches={'day.loading'}>
          Loading...
        </State>
        <State matches={'day.error'}>
          {error}
        </State>
        <State matches={'day.idle'}>
          <table>
            <thead>
            <th>Group</th>
            <th>Start</th>
            <th>Description</th>
            </thead>
            <tbody>
            {tasks.map(task => (
              <tr>
                <td>
                  {task.group ? (
                    <a onClick={() => send({ type: 'NAVIGATE_GROUP', id: task.group.id })}>
                      {task.group.description}
                    </a>
                  ) : (
                    'n/a'
                  )}
                </td>
                <td>{task.start}</td>
                <td>
                  <a onClick={() => send({ type: 'NAVIGATE_TASK', id: task.id })}>
                    {task.description}
                  </a>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </State>
      </div>
    </div>
  )
}