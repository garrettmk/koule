import styled from 'styled-components';
import { Button, SectionDivider, TextInput } from "../../atoms";
import { Page } from "../../containers";
import { fonts, palette, space } from "../../theme";

export const TaskPage = styled(Page)`
  display: flex;
  flex-direction: column;
  padding: ${space.units(2)};
`;

export const SectionHeader = styled(SectionDivider)`
  margin-left: ${space.units(-2)};
  margin-right: ${space.units(-2)};
`;

export const DescriptionInput = styled(TextInput)`
  margin-bottom: ${space.units(2)};
  width: 100%;
`;

export const ActivityFrame = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: auto 1fr;
  grid-gap: ${space.units(2)};
  margin-bottom: ${space.units(2)};
`;

export const ActionButton = styled(Button)`
  //margin: ${space.units(3)} 0;
  background-color: ${palette.primary};
  color: ${palette.textPrimaryLight};
  font: ${fonts.body};
  text-transform: uppercase;
  width: 100%;
`;