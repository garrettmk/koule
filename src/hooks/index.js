import React, { useCallback, useContext } from 'react';
import {MachineProviderContext} from "../containers/MachineProvider";
import {makeUseOfServices} from "../utils";


export function useMachineProvider(selector) {
  const { state, context, send } = useContext(MachineProviderContext);
  return selector({ state, context, send });
}

export function useServiceProvider(selector) {
  const value = useContext(MachineProviderContext);
  const selected = selector(value);

  return makeUseOfServices(selected);
}

export function useUiMachine() {
  const { state, context, send } = useContext(MachineProviderContext);
  const sendUi = useCallback(
    event => send({
      ...event,
      type: `${event.originalTarget.id}On${event.type.capitalize()}`
    }),
    send
  );

  return { state, context, send: sendUi };
}