import styled from 'styled-components';

export const List = styled.ul`
  padding: 0;
  list-style-type: none;
`;

export const ListItemDivider = styled.div`
  position: absolute;
  left: ${ props => props.theme.sizing.units(3) };
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: ${ props => props.theme.colors.divider };
`;

export const ListItemColor = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: ${ props => props.theme.sizing.units(1/2) };
  background-color: ${ props => props.theme.colors[props.color] || props.color };
`;

export const ListItem = styled.li`
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  min-height: ${ props => props.theme.sizing.units(6) };
  padding: ${ props => `${props.theme.sizing.units(1)} ${props.theme.sizing.units(3)}` };
  background-color: ${ props => props.theme.colors.background };
  cursor: pointer;
  font: ${ props => props.theme.fonts.body };
  
  &:last-child ${ListItemDivider} {
    display: none;
  }
  
  &:first-child ${ListItemColor} {
    border-top-left-radius: ${ props => props.theme.sizing.units(1/4) };
    border-top-right-radius: ${ props => props.theme.sizing.units(1/4) };
  }
  
  &:last-child ${ListItemColor} {
    border-bottom-left-radius: ${ props => props.theme.sizing.units(1/4) };
    border-bottom-right-radius: ${ props => props.theme.sizing.units(1/4) };
  }
`;

export const Section = styled.li`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: ${ props => `${props.theme.sizing.units(1)} ${props.theme.sizing.units(3)}`};
  margin-top: ${ props => props.theme.sizing.units(3) };
  margin-bottom: ${ props => props.theme.sizing.units(2) };
  border-bottom: 1px solid ${ props => props.theme.colors.divider };
  font: ${ props => props.theme.fonts.caption };
  color: ${ props => props.theme.colors.text.secondary };
  text-transform: uppercase;
`;