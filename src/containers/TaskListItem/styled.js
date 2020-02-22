import styled from 'styled-components';
import { animated } from "react-spring";
import { sizingUnits, color, font, textColor, fromProp } from "../../theme";
import { Button, Select, TextInput } from "../../components";

export const Root = styled.li`
  position: relative;
  overflow: hidden;
  
  box-shadow: ${props => props.raised
    ? '0px 0px 6px -3px rgba(0,0,0,0.2),0px 0px 12px 1px rgba(0,0,0,0.14),0px 0px 16px 2px rgba(0,0,0,0.12)'
    : 'none'
  };
  
  background-color: ${props => props.raised
    ? props.theme.colors.foreground
    : props.theme.colors.background
  };
  
  transition-property: height, box-shadow, background-color;
  transition-duration: 250ms;
  transition-timing-function: linear;
  transition-delay: 0s;
`;

export const Inner = styled.div`
  position: relative;
  padding: ${sizingUnits(2)};
  
  display: grid;
  grid-template-columns: auto 1fr;
  grid-auto-rows: auto;
  grid-gap: ${sizingUnits(2)};
  
  transition: top 250ms linear;
`;

export const Color = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: ${sizingUnits(1/2)};
  background-color: ${fromProp('color', color, 'divider')};
`;

export const GroupSelect = styled(Select)`
  grid-column: 1 / 3;
  font: ${font('caption')};
  color: ${textColor('secondary')};
  
  &:focus {
    color: ${textColor('primary')};
  }
  
  &:disabled {
    padding: 0;
  }
`;

export const DescriptionInput = styled(TextInput)`
  grid-column: 1 / 3;
  // border-color: ${textColor('secondary')};
  &:disabled {
    padding: 0;
  }
`;

export const DeleteButton = styled(Button)`
  grid-column: 1 / 2;
`;

export const ActionButton = styled(Button)`
  grid-column: 2 / 3;
`;