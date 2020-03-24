import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { State } from "xstate";

export const MachineProviderContext = createContext({});

export function MachineProvider({ service, children }) {
  const [state, setState] = useState(service.state);

  // Update the component on transitions
  useEffect(
    () => void service.onTransition(newState => {
      // if (newState.event.type === 'xstate.update')
      //   return;

      console.log(newState._event);
      // console.count('MachineProvider update');

      const getWorkerChildState = name => {
        // const child = service.children.get(name);
        // return child ? child.state : undefined;

        try {
          return State.create(service.children.get('worker').state.context[name]);
        } catch (e) {
          return undefined;
        }
      };

      const newValue = {
        auth: service.children.get('auth').state,
        ui: getWorkerChildState('ui'),
        nav: getWorkerChildState('nav'),
        apollo: getWorkerChildState('apollo'),
        taskList: getWorkerChildState('taskList'),
        groupList: getWorkerChildState('groupList'),
        task: getWorkerChildState('task'),
        wait: getWorkerChildState('wait'),
      };

      setState(newValue);
    }),
    [service]
  );

  // Provide a special match() function where you can specify the service's state in [brackets]
  const stateMatches = useCallback(
    value => (Array.isArray(value) ? value : [value]).some(
      match => {
        const [_, serviceName] = match.match(/^\[(.*)]/);
        const [__, valueToMatch] = match.match(/^\[.*](.*)/);
        const stateToMatch = state[serviceName];

        if (!stateToMatch) return false;

        try {
          return stateToMatch.matches(valueToMatch);
        }
        catch (e) {
          debugger;
        }
      }
    ),
    [service, state]
  );

  const contextValue = useMemo(
    () => ({
      stateMatches,
      send: service.send,
      ...state
    }),
    [state]
  );

  return (
    <MachineProviderContext.Provider value={contextValue}>
      {children}
    </MachineProviderContext.Provider>
  );
}