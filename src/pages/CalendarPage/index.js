import React, { useContext, useEffect, useMemo } from 'react';
import MessageButton from "../../components/MessageButton";
import { MachineContext } from "../../containers/MachineContext";
import { useApiService } from "../../hooks";
import Service from "../../containers/Service";
import State from "../../containers/State";
import { groupBy } from "../../utils";


export default function CalendarPage() {
  const {
    state,
    context: {
      api: { getTaskCountByDate }
    },
    send: sendToApp
  } = useContext(MachineContext);

  const { send: sendToApi, response, error } = useApiService(getTaskCountByDate);
  const counts = response ? response.task_count_by_date : [];

  return (
    <div>
      <div>
        <MessageButton message={'NAVIGATE_HOME'}>Home</MessageButton>
        <MessageButton message={'NAVIGATE_DAY'}>Today</MessageButton>
        <MessageButton message={'NAVIGATE_TASK'}>Current Task</MessageButton>
        <MessageButton message={'SIGN_OUT'}>Sign out</MessageButton>
      </div>
      <div>
        <Service service={getTaskCountByDate}>
          <State matches={'loading'}>
            Loading...
          </State>
          <State matches={'success'}>
            <table>
              <thead>
                <th>Date</th>
                <th>Tasks</th>
              </thead>
              <tbody>
                {counts.map(({ date, count }) => (
                  <tr>
                    <td><a onClick={() => sendToApp({ type: 'NAVIGATE_DAY', date })}>{date}</a></td>
                    <td>{count}</td>
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