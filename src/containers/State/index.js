import React, { useContext } from 'react';
import { MachineContext } from '../../containers/MachineContext';


export default function State({ matches, children }) {
  const { state } = useContext(MachineContext);

  if (!state.matches(matches))
    return null;

  return children;
}