import styled from "styled-components";

export const SvgIcon = styled.svg`
  width: ${ props => props.theme.sizing.icons[props.size || 'regular'] };
  height: ${ props => props.theme.sizing.icons[props.size || 'regular'] };
  color: ${ props => props.theme.colors.text.primary };
`;