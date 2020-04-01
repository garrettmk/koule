import React, { useRef } from 'react';
import { useTransition } from "react-spring";
import { useMachineProvider } from "../../hooks";
import * as S from './styled';

const TRANSITIONS = {
  rtl: {
    from: { opacity: 1, transform: 'translate3d(100%,0,0)' },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
  },
  ltr: {
    from: { opacity: 1, transform: 'translate3d(-100%,0,0)' },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)', zIndex: 100 },
    leave: { opacity: 0, transform: 'translate3d(50%,0,0)', zIndex: 50 },
  }
};

export function Pager({ children, ...props }) {
  const { stateMatches } = useMachineProvider();

  const childArray = React.Children.toArray(children);
  const matchedIndex = childArray.findIndex(child => child.props.not
    ? !stateMatches(child.props.matches)
    : stateMatches(child.props.matches)
  );

  const matchedChild = childArray[matchedIndex];
  const lastMatchedIndex = useRef(matchedIndex);
  const direction = matchedIndex < lastMatchedIndex ? 'ltr' : 'rtl';

  const transitions = useTransition(
    matchedChild,
    child => child && child.props.matches,
    TRANSITIONS[direction]
  );

  lastMatchedIndex.current = matchedIndex;

  return (
    <S.Root {...props}>
      {transitions.map(({ item, key, props }) => item && React.cloneElement(item, {
        key,
        style: { ...props, ...item.props.style }
      }))}
    </S.Root>
  );
}