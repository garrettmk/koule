import styled from 'styled-components';
import { animated } from "react-spring";

export const List = styled.ul`
  padding: 0;
`;

export const ListItem = styled.li`
  display: flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  min-height: ${ props => props.theme.sizing.units(7) };
  padding: ${ props => `${props.theme.sizing.units(1)} ${props.theme.sizing.units(3)}` };
  background-color: ${ props => props.theme.colors.background };
  cursor: pointer;
`;

export const SelectedBackground = styled(animated.div)`
  position: absolute;
  display: flex;
  align-items: center;
  inset: 0;
  padding: ${ props => `${props.theme.sizing.units(1)} ${props.theme.sizing.units(3)}` };
  box-sizing: border-box;
  background-color: ${ props => props.theme.colors[props.color] };
  clip-path:  ${ props => props.open
    ? 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%)'
    : 'polygon(0% 0%, 0% 100%, 4px 100%, 4px 0%)' };
  transition: clip-path 175ms ease-out;
  cursor: pointer;
`;

export const ListSubHeader = styled.li`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  margin: ${ props => `${props.theme.sizing.units(2)} ${props.theme.sizing.units(3)}` };
  margin-top: ${ props => props.theme.sizing.units(4) };
  font: ${ props => props.theme.fonts.caption };
  color: ${ props => props.theme.colors.text.secondary };
`;