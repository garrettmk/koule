import React, { useContext } from 'react';
import { ThemeProvider, ThemeContext } from 'styled-components';
import { lightTheme } from "../../theme";
import * as S from './styled';
import { useSpring } from "react-spring";
import { ResizeObserver } from "@juggle/resize-observer";
import useMeasure from 'react-use-measure';


function ListItem({ color: colorProp = 'gray', selected, children, ...props }) {
  const { colors: themeColors } = useContext(ThemeContext);

  const [ref, bounds] = useMeasure({ polyfill: ResizeObserver });
  const { width, height } = bounds;

  const selectedClip = `rect(0px ${width}px ${height}px 0px)`;
  const normalClip = `rect(0px 4px ${height}px 0px)`;

  const animatedProps = useSpring({ clip: selected ? selectedClip : normalClip });

  return (
    <S.ListItem {...props}>
      {children}
      <ThemeProvider theme={currentTheme => themeColors[colorProp] ? lightTheme : currentTheme}>
        <S.SelectedBackground ref={ref} color={colorProp} style={animatedProps}>
          {children}
        </S.SelectedBackground>
      </ThemeProvider>
    </S.ListItem>
  );
}

export const List = S.List;
List.Item = ListItem;
List.SubHeader = S.ListSubHeader;