import React from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from "../../theme";
import * as S from './styled';


function ListItem({ color = 'gray', selected, children, ...props }) {
  return (
    <S.ListItem {...props}>
      {children}
      <ThemeProvider theme={lightTheme}>
        <S.SelectedBackground color={color} open={selected}>
          {children}
        </S.SelectedBackground>
      </ThemeProvider>
    </S.ListItem>
  );
}

export const List = S.List;
List.Item = ListItem;
List.SubHeader = S.ListSubHeader;