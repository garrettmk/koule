import styled from "styled-components";

export const SvgIcon = styled.svg`
  width: ${ props => props.theme.sizing.icons[props.size || 'regular'] };
  height: ${ props => props.theme.sizing.icons[props.size || 'regular'] };
  color: ${ props => props.color 
    ? props.theme.colors[props.color]
    : props.theme.colors.text.primary 
  };
`;