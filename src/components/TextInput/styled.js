import styled from 'styled-components';

export const Input = styled.input`
  padding: ${ props => props.theme.sizing.units(1) };
  box-sizing: border-box;
  background-color: transparent;
  border-width: 2px;
  border-color: transparent;
  border-style: solid;
  border-radius: 4px;
  color: ${ props => props.theme.colors.text.primary };
  font: ${ props => props.theme.fonts[props.fontVariant || 'body'] };
  
  &:hover:not([readonly]), &:focus:not([readonly]) {
    border-color: ${ props => props.theme.colors.text.secondary };
  }
  
  &[disabled] {
    pointer-events: none;
  }
  
  transition: border-color 100ms linear;
`;