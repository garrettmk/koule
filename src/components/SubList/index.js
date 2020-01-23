import styled from "styled-components";

export const SubList = styled.ul`
  padding: 0;
`;

SubList.Item = styled.li`
  display: flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  min-height: ${ props => props.theme.sizing.units(6) };
  padding: ${ props => `${props.theme.sizing.units(2)} ${props.theme.sizing.units(3)}` };
  background-color: ${ props => props.theme.colors.background };
  border-left: ${ props => `${props.theme.sizing.units(1/2)} solid ${props.theme.colors[props.color] || props.theme.colors.foreground}` };
`;
