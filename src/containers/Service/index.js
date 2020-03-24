import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MachineProviderContext } from "../MachineProvider";
import { useService } from "@xstate/react/lib";
import { interpret } from "xstate";

export function Service({ service, children }) {
  const [state, setState] = useState(service._state);
  const [serviceStates, setServiceStates] = useState({});

  // Update the component on transitions
  useEffect(
    () => void service.onTransition(newState => {
      console.log(newState._event);
      let childStates = {};
      service.children.forEach((value, key) => {
        childStates[key] = value.machine.id === 'worker-wrapper-machine'
          ? value.state.context.state
          : value.state;
      });

      setServiceStates(childStates);
      setState(newState);
    }),
    []
  );

  // Provide a special match() function where you can specify the service's state in [brackets]
  const stateMatches = useCallback(
    value => (Array.isArray(value) ? value : [value]).some(
      match => {
        const [_, serviceName] = (match.match(/^\[(.*)]/) || []);
        const valueToMatch = serviceName ? match.match(/^\[.*](.*)/)[1] : match;
        const stateToMatch = serviceName ? service.children.get(serviceName)._state : state;

        return stateToMatch.matches(valueToMatch);
      }
    ),
    [service, state]
  );

  const contextValue = useMemo(
    () => ({
      state,
      stateMatches,
      context: state.context,
      send: service.send,
      ...serviceStates
    }),
    [state]
  );

  return (
    <MachineProviderContext.Provider value={contextValue}>
      {children}
    </MachineProviderContext.Provider>
  );
}