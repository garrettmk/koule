import styled from 'styled-components';
import { ListItemPrimary } from "../ListItemPrimary";
import { ListItemSecondary } from "../ListItemSecondary";

export const List = styled.ul`
  padding: 0;
  margin: 0;

  ${ListItemPrimary}:last-child {
    border-bottom-color: transparent;
  }
  
  ${ListItemSecondary}:last-child::after {
    display: none;
  }
`;