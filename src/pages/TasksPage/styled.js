import styled from 'styled-components';
import { List, Text } from "../../components";

export const Page = styled.div`
  flex: 1 1 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  font: ${ props => props.theme.fonts.body };
  color: ${ props => props.theme.colors.text.primary };
`;

export const GroupItem = styled(List.Item)`
  padding-top: 0;
  padding-bottom: 0;
`;

export const GroupDescription = styled(Text.Caption)`
  display: block;
  padding-top: ${ props => props.theme.sizing.units(1.5) };
  color: ${ props => props.theme.colors.text.secondary };
`;

export const TaskItem = styled(List.Item)`
  padding-left: 0px;
  margin-right: -24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const TaskItemDivider = styled(List.Divider)`
  left: 0;
`;

export const TaskDescription = styled(Text.Body)`
  // TBC...
`;

export const TaskDuration = styled(Text.Caption)`
  color: ${ props => props.theme.colors.text.secondary };
  white-space: nowrap;
`;