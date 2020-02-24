import React from 'react';
import {useMachineProvider} from "../../hooks";


export function State({ not, matches, children }) {
  const state = useMachineProvider(({ state }) => state);

  let isAMatch = (Array.isArray(matches) ? matches : [matches]).reduce(
    (result, match) => result || state.matches(match),
    false
  );

  if (not)
    isAMatch = !isAMatch;

  if (isAMatch)
    return children;

  return null;
}