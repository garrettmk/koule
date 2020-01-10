import React, {useMemo} from 'react';
import {useService} from "@xstate/react";
import {bindEventCreators} from "../../utils";
import { MachineProviderContext } from "../MachineProvider";


export default function Service({ service, eventCreators, children }) {
  const [state, send] = useService(service);

  const value = useMemo(
    () => ({
      state: state,
      context: state.context,
      send,
      ...bindEventCreators(eventCreators, send),
    }),
    [state, eventCreators, send]
  );

  return (
    <MachineProviderContext.Provider value={value}>
      {typeof children === 'function'
        ? children(value)
        : children
      }
    </MachineProviderContext.Provider>
  )
}