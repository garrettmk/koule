import React from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from "../../theme";
import * as S from './styled';
import { useSpring } from "react-spring";
import { ResizeObserver } from "@juggle/resize-observer";
import useMeasure from 'react-use-measure';


function ListItem({ color = 'gray', selected, children, ...props }) {
  const [ref, bounds] = useMeasure({ polyfill: ResizeObserver });
  const { width, height } = bounds;

  const selectedClip = `rect(0px ${width}px ${height}px 0px)`;
  const normalClip = `rect(0px 4px ${height}px 0px)`;

  const animatedProps = useSpring({ clip: selected ? selectedClip : normalClip });

  return (
    <S.ListItem {...props}>
      {children}
      <ThemeProvider theme={lightTheme}>
        <S.SelectedBackground ref={ref} color={color} style={animatedProps}>
          {children}
        </S.SelectedBackground>
      </ThemeProvider>
    </S.ListItem>
  );
}

export const List = S.List;
List.Item = ListItem;
List.SubHeader = S.ListSubHeader;