import React, {useContext} from 'react';
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