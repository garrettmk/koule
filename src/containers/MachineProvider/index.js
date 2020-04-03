import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { State, interpret  } from "xstate";
import { AuthMachine, PageVisibilityMachine } from "../../machines";
import authConfig from '../../config/auth';
import AppWorker from 'worker-loader!../../appWorker'; // eslint-disable-line import/no-webpack-loader-syntax

export const MachineProviderContext = createContext({});

export function MachineProvider({ children }) {
  const worker = useRef(null);
  const authService = useRef(null);
  const pageService = useRef(null);
  const [state, setState] = useState({});

  useEffect(
    () => {
      worker.current = new AppWorker();

      const parent = { send: event => worker.current.postMessage(JSON.stringify(event)) };

      authService.current = interpret(
        AuthMachine.withContext({ config: authConfig }),
        { parent }
      );

      pageService.current = interpret(
        PageVisibilityMachine,
        { parent }
      );

      // Update the state value, or send a message to auth
      worker.current.addEventListener('message', ({ data }) => {
        const event = JSON.parse(data);
        console.log('@worker, ', event);

        if (event.type === 'worker.state') {
          const newState = { auth: authService.current.state };
          Object.entries(event.states).forEach(([name, state]) =>
            newState[name] = State.create(state)
          );
          setState(newState);
        } else {
          authService.current.send(event);
        }
      });

      authService.current.start();
      pageService.current.start();

      return () => {
        worker.current.terminate();
        authService.current.stop();
        pageService.current.stop();
      }
    },
    []
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
    [state]
  );

  const contextValue = useMemo(
    () => ({
      stateMatches,
      send: event => worker.current.postMessage(JSON.stringify(event)),
      ...state
    }),
    [state]
  );

  if (!state.ui)
    return null;

  return (
    <MachineProviderContext.Provider value={contextValue}>
      {children}
    </MachineProviderContext.Provider>
  );
}