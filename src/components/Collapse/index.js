import React from 'react';
import { useSpring } from "react-spring";
import { ResizeObserver } from '@juggle/resize-observer';
import useMeasure from 'react-use-measure';
import * as S from './styled';

function _Outer({ open = true, style, children, ...props }) {
  const [ref, bounds] = useMeasure({ polyfill: ResizeObserver });
  const animatedProps = useSpring({ height: open ? bounds.height : 0 });
  const innerElement = React.Children.only(children);
  const innerElWithRef = React.cloneElement(innerElement, { ref });

  return (
    <S.Outer style={{ ...animatedProps, ...style }} {...props}>
      {innerElWithRef}
    </S.Outer>
  );
}

export const Collapse = {
  Outer: _Outer,
  Inner: S.Inner,
};