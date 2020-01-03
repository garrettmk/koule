import React, { useContext, useState, useEffect } from 'react';
import MessageButton from "../../components/MessageButton";
import { MachineContext } from "../../containers/MachineContext";
import { useService } from "@xstate/react/lib";
import Service from "../../containers/Service";
import State from "../../containers/State";
import { get } from "../../utils";

export default function TaskPage() {
  const { context: { task } } = useContext(MachineContext);
  const [taskState, sendTask] = useService(task);
  const { task: taskData, api } = taskState.context;
  const [apiState, sendApi] = useService(api);

  const [description, setDescription] = useState(get(taskData, 'description'));
  useEffect(
    () => setDescription(get(taskData, 'description')),
    [get(taskData, 'description')]
  );

  const handleSubmitDescription = () => {
    sendTask({ type: 'EDIT', edits: { description } })
  };

  return (
    <div>
      <div>
        <MessageButton message={'NAVIGATE_HOME'}>Home</MessageButton>
        <MessageButton message={'NAVIGATE_CALENDAR'}>Calendar</MessageButton>
        <MessageButton message={'NAVIGATE_DAY'}>Today</MessageButton>
        <MessageButton message={'SIGN_OUT'}>Sign out</MessageButton>
      </div>
      <div>
        <Service service={api}>
          <State matches={'loading'}>
            Loading...
          </State>
          <State matches={'mutating'}>
            Sending...
          </State>
          <State matches={'error'}>
            Error: {get(apiState.context, 'error.message')}
          </State>
        </Service>
        <div>
          <ul>
            <li>
              Group: {get(taskData, 'group.description')}
            </li>
            <li>
              Start: {get(taskData, 'start')}
            </li>
            <li>
              End: {get(taskData, 'end')}
            </li>
            <li>
              Description: {get(taskData, 'description')}
              <input
                type={'text'}
                value={description}
                onChange={event => setDescription(event.target.value)}
                onKeyDown={event => event.key === 'Enter' ? handleSubmitDescription() : null}
              />
            </li>
            <li>
              Status:{' '}
              <Service service={task}>
                <State matches={'invalid'}>
                  Invalid
                </State>
                <State matches={'ready'}>
                  Ready
                </State>
                <State matches={'running'}>
                  Running
                </State>
                <State matches={'finished'}>
                  Finished
                </State>
              </Service>
            </li>
          </ul>
          <Service service={task}>
            <State matches={'ready'}>
              <button onClick={() => sendTask('START')}>Start</button>
            </State>
            <State matches={'running'}>
              <button onClick={() => sendTask('FINISH')}>Finish</button>
              <button onClick={() => sendTask('FINISH_AND_NEW')}>Finish & New</button>
            </State>
            <State matches={'finished'}>
              <button onClick={() => sendTask('FINISH_AND_NEW')}>New Task</button>
            </State>
          </Service>
        </div>
      </div>
    </div>
  );
}