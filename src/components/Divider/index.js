import styled from 'styled-components';

export const Divider = styled.hr`
  color: ${ props => props.theme.colors.divider };
  background-color: ${ props => props.theme.colors.divider };
`;