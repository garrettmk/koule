import styled from 'styled-components';
import { color, textColor, sizingUnits, font } from "../../theme";

export const Select = styled.select`
  -moz-appearance: none;
  -webkit-appearance: none;
  
  position: relative;
  box-sizing: border-box;
  padding: ${ props => `calc(${props.theme.sizing.units(1)} - 2px)` };
  background-color: transparent;
  border: 2px solid transparent;
  border-radius: 4px;
  
  color: ${textColor('primary')};
  font: ${font('body')};
  cursor: pointer;
  
  &:hover:not([disabled]) {
    border-color: ${textColor('secondary')};
  }
  
  &:focus {
    border-color: ${textColor('primary')};
  }
  
  transition: border-color 100ms linear;
  
  & option {
    color: black;
  }
`;