import React, { useContext, useEffect } from 'react';
import MessageButton from "../../components/MessageButton";
import { MachineContext } from "../../containers/MachineContext";
import { useApiService } from "../../hooks";
import State from "../../containers/State";
import Service from "../../containers/Service";

export default function DayPage() {
  const { send, context: { date, api: { getTasks } } } = useContext(MachineContext);
  const { response, error } = useApiService(getTasks);
  const tasks = response && !error ? response.tasks : [];

  return (
    <div>
      <div>
        <MessageButton message={'NAVIGATE_HOME'}>Home</MessageButton>
        <MessageButton message={'NAVIGATE_CALENDAR'}>Calendar</MessageButton>
        <MessageButton message={'NAVIGATE_TASK'}>Current Task</MessageButton>
        <MessageButton message={'SIGN_OUT'}>Sign out</MessageButton>
      </div>
      <div>
        <Service service={getTasks}>
          <State matches={'loading'}>
            Loading...
          </State>
          <State matches={'success'}>
            <table>
              <thead>
                <th>Start</th>
                <th>Description</th>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr>
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
          <State matches={'error'}>
            There was an error: {error && error.message}
          </State>
        </Service>
      </div>
    </div>
  )
}