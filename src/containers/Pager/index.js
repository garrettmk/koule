import React, { useRef } from 'react';
import { useTransition } from "react-spring";
import { useMachineProvider } from "../../hooks";
import * as S from './styled';

const PAGE_FORWARD = {
  from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
  enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
  leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
};

const PAGE_BACKWARD = {
  from: { opacity: 0, transform: 'translate3d(-100%,0,0)' },
  enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
  leave: { opacity: 0, transform: 'translate3d(50%,0,0)' },
};

export function Page({ matches, children, ...props }) {
  return (
    <S.Page {...props}>
      {children}
    </S.Page>
  );
}

export function Pager({ children, ...props }) {
  const state = useMachineProvider(({ state }) => state);
  const childArray = React.Children.toArray(children);
  const matchedIndex = childArray.findIndex(child => state.matches(child.props.matches));
  const matchedChild = childArray[matchedIndex];
  const lastMatchedIndex = useRef(matchedIndex);

  const transitions = useTransition(
    matchedChild,
    child => child && child.props.matches,
    matchedIndex - lastMatchedIndex.current >= 0
      ? PAGE_FORWARD
      : PAGE_BACKWARD
  );

  lastMatchedIndex.current = matchedIndex;

  return (
    <S.Pager {...props}>
      {transitions.map(({ item, key, props }) => item && React.cloneElement(item, {
        key,
        style: { ...props, ...item.props.style }
      }))}
    </S.Pager>
  );
}