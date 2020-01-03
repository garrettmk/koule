import React, { useContext, useMemo } from 'react';
import { useService } from "@xstate/react";
import { MachineContext } from '../../containers/MachineContext';
import { bindEventCreators } from "../../utils";


export default function Service({ service, eventCreators, children }) {
  const parent = useContext(MachineContext);
  const [current, send] = useService(service);

  const value = useMemo(
    () => ({
      parent,
      state: current,
      context: current.context,
      send,
      ...bindEventCreators(eventCreators, send),
    }),
    [current, eventCreators, send]
  );

  return (
    <MachineContext.Provider value={value}>
      {children}
    </MachineContext.Provider>
  )
}