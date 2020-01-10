import React, {createContext, useMemo} from "react";
import {useMachine} from "@xstate/react/lib";

export const MachineProviderContext = createContext({});

export default function MachineProvider({ machine, children }) {
  const [state, send] = useMachine(machine);
  const value = useMemo(
    () => ({
      state,
      context: state.context,
      send,
    }),
    [state, send]
  );

  return (
    <MachineProviderContext.Provider value={value}>
      {children}
    </MachineProviderContext.Provider>
  );
}