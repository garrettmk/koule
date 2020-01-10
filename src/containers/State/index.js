import React from 'react';
import {useMachineProvider} from "../../hooks";


export default function State({ matches, children }) {
  const state = useMachineProvider(({ state }) => state);

  const isAMatch = (Array.isArray(matches) ? matches : [matches]).reduce(
    (result, match) => result || state.matches(match),
    false
  );

  if (isAMatch)
    return children;

  return null;
}