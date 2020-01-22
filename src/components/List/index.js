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

  const openClipPath = `polygon(0px 0px, 0px ${height}px, ${width}px ${height}px, ${width}px 0px)`;
  const closedClipPath = `polygon(0px 0px, 0px ${height}px, 4px ${height}px, 4px 0px)`;

  const animatedProps = useSpring({ clipPath: selected ? openClipPath : closedClipPath });

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