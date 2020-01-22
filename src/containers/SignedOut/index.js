import React from 'react';
import {useMachineProvider} from "../../hooks";

export function SignedOut({ children }) {
  const state = useMachineProvider(({ state }) => state);

  if (state.matches('auth.signedOut'))
    return children;

  return null;
}