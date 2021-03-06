import React, { useRef, Children } from 'react';
import { useTransition, useSprings } from "react-spring";
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

  const childArray = Children.toArray(children);
  const matchedIndex = childArray.findIndex(child => child.props.not
    ? !stateMatches(child.props.matches)
    : stateMatches(child.props.matches)
  );

  const lastMatchedIndex = useRef(matchedIndex);

  const springs = useSprings(
    childArray.length,
    childArray.map((child, index) => index <= matchedIndex
      ? { transform: 'translateX(0%)' }
      : { transform: 'translateX(100%)' }
    )
  );

  lastMatchedIndex.current = matchedIndex;

  return (
    <S.Root {...props}>
      {springs.map((props, index) => (
        React.cloneElement(childArray[index], {
          style: { ...props, ...childArray[index].props.style }
        })
      ))}
    </S.Root>
  );
}