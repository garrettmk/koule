import React from 'react';
import {useMachineProvider} from "../../hooks";


export function State({ not, matches, children }) {
  const { stateMatches } = useMachineProvider();

  const isAMatch = not
    ? !stateMatches(matches)
    : stateMatches(matches);

  return isAMatch
    ? children
    : null;
}