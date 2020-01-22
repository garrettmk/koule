import styled from 'styled-components';

export const TaskPage = styled.div`
  flex: 1 1 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  font: ${ props => props.theme.fonts.body };
  color: ${ props => props.theme.colors.text.primary };
`;