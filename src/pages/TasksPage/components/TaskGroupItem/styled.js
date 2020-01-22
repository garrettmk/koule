import styled from 'styled-components';
import {
  List,
  SubList,
  Divider as DividerComponent
} from "../../../../components";

export const Divider = styled(DividerComponent)`
  margin: 0;
  margin-left: ${ props => props.theme.sizing.units(3) };
`;

export const ListItem = styled(List.Item)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SubListItem = styled(SubList.Item)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;