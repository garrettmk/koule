import React, { useContext, useMemo } from 'react';
import { useService } from "@xstate/react/lib";
import { MachineContext } from "../containers/MachineContext";


export function useApiService(service) {
  const [state, send] = useService(service);

  return useMemo(
    () => ({
      state,
      send,
      response: state.context.response,
      error: state.context.error,
    }),
    [state, send]
  );
}