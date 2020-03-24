import React from 'react';
import { useMachineProvider } from "../../hooks";
import { useService } from "@xstate/react/lib";

export function SignedIn({ children }) {
  const auth = useMachineProvider(({ context }) => context.auth);
  const [state] = useService(auth);

  if (state.matches('signedIn'))
    return children;

  return null;
}