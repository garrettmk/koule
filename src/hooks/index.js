import React, { useMemo, useContext } from 'react';
import {MachineProviderContext} from "../containers/MachineProvider";
import {makeUseOfServices} from "../utils";
import { useService } from "@xstate/react/lib";

const defaultSelector = value => value;

export function useMachineProvider(selector = defaultSelector) {
  const contextValue = useContext(MachineProviderContext);
  return selector(contextValue);
}

export function useServiceProvider(selector) {
  const value = useContext(MachineProviderContext);
  const selected = selector(value);

  return makeUseOfServices(selected);
}

export function useUiMachine(selector) {
  const ui = useMachineProvider(({ context }) => context.ui);
  const [state, send] = useService(ui);

  return selector({ state, context: state.context, send });
}