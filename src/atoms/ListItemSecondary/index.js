import React, { Children } from 'react';
import styled from 'styled-components';
import { palette, fonts, space } from "../../theme";

export const ListItemSecondary = styled.li`
  position: relative;
  box-sizing: border-box;
  background-color: ${palette.foreground};
  color: ${palette.textSecondary};
  min-height: ${space.units(6)};
  padding: ${space.units(1)} ${space.units(2)};
  display: grid;
  grid-gap: ${space.units(2)};
  grid-template-rows: auto;
  grid-template-columns: ${ ({ children }) =>
    Children.count(children) === 3 ? 'auto 1fr auto' :
    Children.count(children) === 2 ? '1fr auto' :
    '1fr' };
  align-content: center;
  align-items: center;
  font: ${fonts.body2};
  
  cursor: ${ ({ onClick }) => onClick ? 'pointer' : 'default' };
  
  &::after {
    content: "";
    display: block;
    position: absolute;
    left: ${space.units(2)};
    right: 0;
    bottom: 0;
    height: 1px;
    background-color: ${palette.divider};
  }
`;