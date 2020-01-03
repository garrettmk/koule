import React, { useContext } from 'react';
import { MachineContext } from "../../containers/MachineContext";

export default function MessageButton({ message, ...props }) {
  const { send } = useContext(MachineContext);
  return (
    <button onClick={() => send(message)} {...props}/>
  );
}