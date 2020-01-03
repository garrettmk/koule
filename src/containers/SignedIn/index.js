import React, { useContext } from 'react';
import { MachineContext } from "../../containers/MachineContext";
import { useService } from "@xstate/react/lib";

export default function SignedIn({ children }) {
  const { context: { auth } } = useContext(MachineContext);
  const [current] = useService(auth);

  if (!current.matches('signedIn'))
    return null;

  return children;
}