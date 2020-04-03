import React, { Children } from 'react';
import styled from 'styled-components';
import { space, palette, fonts } from "../../theme";

export const ListItemPrimary = styled.li`
  box-sizing: border-box;
  min-height: ${space.units(6)};
  padding: ${space.units(1)} ${space.units(2)};
  background-color: ${palette.foreground};
  position: relative;
  display: grid;
  align-content: center;
  align-items: center;
  grid-gap: ${space.units(2)};
  grid-template-rows: auto;
  grid-template-columns: 1fr auto;
  
  color: ${palette.textPrimary};
  font: ${fonts.body};
  //border-bottom: 1px solid ${palette.divider};
  margin-top: 1px;
  
  cursor: ${ ({ onClick }) => onClick ? 'pointer' : 'default' };
`;