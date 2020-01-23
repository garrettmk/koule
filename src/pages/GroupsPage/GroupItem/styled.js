import styled from 'styled-components';
import { TextInput, IconButton, SubList } from "../../../components";

export const DescriptionInput = styled(TextInput)`
  color: ${ props => props.theme.colors.text.secondary };
  font: ${ props => props.theme.fonts.subtitle };
  flex: 1 1 100%;
  
  &:enabled {
    color: ${ props => props.theme.colors.text.primary };
  }
`;

export const TrashButton = styled(IconButton)`
  flex: 0 0 auto;
  margin-left: ${ props => props.theme.sizing.units(2) };
  background-color: transparent;
  opacity: 0;
  
  &:enabled {
    opacity: 1
  }
  
  transition: opacity 300ms ease-in;
`;

export const SubListItem = styled(SubList.Item)`
  border-left: 4px solid ${ props => props.theme.colors[props.color || 'gray'] };
`;