import React, { useContext } from 'react';
import { MachineContext } from "../../containers/MachineContext";
import { useService } from "@xstate/react/lib";

export default function SignedOut({ children }) {
  const { context: { auth } } = useContext(MachineContext);
  const [current] = useService(auth);

  if (!current.matches('signedOut'))
    return null;

  return children;
}