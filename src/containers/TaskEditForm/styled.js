import styled from 'styled-components';
import { TextInput, Button, Select } from '../../components';
import { color, font, fromProp, sizingUnits, textColor } from "../../theme";


export const Root = styled.div`
  width: 100vw;
  padding: ${sizingUnits(2)};
  box-sizing: border-box;
  position: relative;
  background-color: ${color('foreground')};
  box-shadow: 0px 0px 6px -3px rgba(0,0,0,0.2),0px 0px 12px 1px rgba(0,0,0,0.14),0px 0px 16px 2px rgba(0,0,0,0.12);
  display: grid;
  grid-template-columns: auto 1fr;
  grid-auto-rows: auto;
  grid-gap: ${sizingUnits(2)};
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
`;

export const DescriptionInput = styled(TextInput)`
  grid-column: 1 / 3;
  // border-color: ${textColor('secondary')};
`;

export const DeleteButton = styled(Button)`
  grid-column: 1 / 2;
  color: ${textColor('primary')};
  background-color: ${color('error')};
  border-color: ${color('error')};
`;

export const ActionButton = styled(Button)`
  grid-column: 2 / 3;
  color: ${textColor('primary')};
  background-color: ${color('primary')};
  border-color: ${color('primary')};
`;