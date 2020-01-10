import React from 'react';
import {useMachineProvider} from "../../hooks";

export default function MessageButton({ message, ...props }) {
  const send = useMachineProvider(({ send }) => send);
  return (
    <button onClick={() => send(message)} {...props}/>
  );
}