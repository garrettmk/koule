import React from 'react';
import State from '../../containers/State';
import {useMachineProvider} from "../../hooks";
import TextInput from "../../components/TextInput";
import Navigation from "../../components/Navigation";


export default function GroupPage() {
  const { group, send, error } = useMachineProvider(({ send, context }) => ({
    send,
    group: context.group.data,
    error: context.group.error,
  }));

  return (
    <div>
      <Navigation/>
      <div>
        <State matches={'group.loading'}>
          Loading...
        </State>
        <State matches={'group.saving'}>
          Saving...
        </State>
        <State matches={'group.error'}>
          {error}
        </State>
        <State matches={['group.invalid', 'group.valid', 'group.saving']}>
          <ul>
            <li>
              Description:
              <TextInput
                value={group.description}
                onSubmit={newValue => send({
                  type: 'UPDATE_GROUP',
                  group: { description: newValue }
                })}
              />
            </li>
            <li>
              Color:
              <div style={{
                display: 'inline-block',
                width: 50,
                height: 50,
                backgroundColor: group.color
              }}/>
            </li>
            <li>
              Status:
              <State matches={'group.invalid'}>
                Invalid
              </State>
              <State matches={'group.valid'}>
                Valid
              </State>
            </li>
          </ul>
          <State matches={'group.valid'}>
            <button onClick={() => send('SAVE_GROUP')}>Save</button>
          </State>
        </State>
      </div>
    </div>
  );
}