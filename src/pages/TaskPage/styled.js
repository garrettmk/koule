import styled from 'styled-components';
import { Button, Text } from "../../components";
import { PageHeader as PageHeaderComponent } from "../../containers";
import { sizingUnits, color } from "../../theme";

export const Page = styled.div`
  flex: 1 1 100%;
  padding: 0px ${sizingUnits(2)};
  padding-top: ${ props => props.theme.sizing.header };
  position: relative;
  display: flex;
  flex-direction: column;
  font: ${ props => props.theme.fonts.body };
  color: ${ props => props.theme.colors.text.primary };
`;

export const PageHeader = styled(PageHeaderComponent)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;

export const StatusMessage = styled(Text.Caption)`
  padding: ${sizingUnits(2)} 0px;
  font: ${ props => props.theme.fonts.caption };
  color: ${ props => props.theme.colors.text.primary };
`;

export const Section = styled(Text.Caption)`
  padding-top: ${sizingUnits(3)};
  padding-bottom: ${sizingUnits(2)};
  text-transform: uppercase;
`;

export const GroupContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: ${sizingUnits(2)};
`;

export const DurationContainer = styled.div`
  flex: 1 1 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Duration = styled(Text.Title)``;

export const ActionButton = styled(Button)`
  margin-top: ${sizingUnits(6)};
  align-self: center;
  background-color: ${color('blue')};
  border-color: ${color('blue')};
`;