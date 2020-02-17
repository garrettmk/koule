import styled from 'styled-components';

export const Page = styled.div`
  flex: 1 1 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  font: ${ props => props.theme.fonts.body };
  color: ${ props => props.theme.colors.text.primary };
`;
