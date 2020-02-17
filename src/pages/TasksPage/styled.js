import styled from 'styled-components';

export const Page = styled.div`
  flex: 1 1 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  font: ${ props => props.theme.fonts.body };
  color: ${ props => props.theme.colors.text.primary };
`;

export const List = styled.ul`
  padding: 0;
`;

export const DateItem = styled.li`
  margin-top: ${ props => props.theme.sizing.units(3) };
  margin-bottom: ${ props => props.theme.sizing.units(2) };
  padding: 0px ${ props => props.theme.sizing.units(2) };
  font: ${ props => props.theme.fonts.caption };
  color: ${ props => props.theme.colors.text.secondary };
  text-transform: uppercase;
`;

export const GroupItem = styled.li`
  position: relative;
  margin: ${ props => props.theme.sizing.units(2) } 0px;
  padding: ${ props => props.theme.sizing.units(1) } ${ props => props.theme.sizing.units(2) };
`;

export const GroupItemColor = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: ${ props => props.theme.sizing.units(1/2) };
  background-color: ${props => props.color
    ? props.theme.colors[props.color]
    : props.theme.colors.divider
  };
  border-radius: ${ props => props.theme.sizing.units(1/4) };
`;

export const TaskItemDivider = styled.div`
  position: absolute;
  left: 0;
  right: ${ props => props.theme.sizing.units(-2) };
  bottom: 0;
  height: 1px;
  background-color: ${ props => props.theme.colors.divider };
`;

export const TaskItem = styled.li`
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  min-height: ${ props => props.theme.sizing.units(6) };
  cursor: pointer;
  font: ${ props => props.theme.fonts.body };
`;