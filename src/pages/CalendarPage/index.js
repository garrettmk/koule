import React from 'react';
import {useMachineProvider} from "../../hooks";
import State from "../../containers/State";
import Navigation from "../../components/Navigation";


export default function CalendarPage() {
  const { send, counts, error } = useMachineProvider(({ send, context }) => ({
    send,
    counts: context.calendar.data,
    error: context.calendar.error,
  }));

  return (
    <div>
      <Navigation/>
      <div>
        <State matches={'calendar.loading'}>
          Loading...
        </State>
        <State matches={'calendar.error'}>
          {error}
        </State>
        <State matches={'calendar.idle'}>
          <table>
            <thead>
            <th>Date</th>
            <th>Tasks</th>
            </thead>
            <tbody>
            {counts.map(({ date, count }) => (
              <tr>
                <td><a href={'#'} onClick={() => send({ type: 'NAVIGATE_DAY', date })}>{date}</a></td>
                <td>{count}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </State>
      </div>
    </div>
  )
}