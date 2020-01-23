import styled from 'styled-components';

export const ColorSwatch = styled.span`
  width: ${ props => props.theme.sizing.units(3) };
  height: ${ props => props.theme.sizing.units(3) };
  border-radius: ${ props => props.theme.sizing.units(1/2) };
  background-color: ${ props => props.theme.colors[props.color] 
    ? props.theme.colors[props.color]
    : 'transparent' };
  background-color: ${ props => props.theme.colors[props.color] || 'transparent' };
  border: ${ props => props.theme.colors[props.color] 
    ? 'none'
    : '1px dashed ' + props.theme.colors.text.secondary };
`;