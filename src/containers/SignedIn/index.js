import React from 'react';
import {useMachineProvider} from "../../hooks";

export function SignedIn({ children }) {
  const state = useMachineProvider(({ state }) => state);

  if (state.matches('auth.signedIn'))
    return children;

  return null;
}