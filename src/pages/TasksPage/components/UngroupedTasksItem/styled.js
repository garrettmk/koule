import styled from "styled-components";
import { Divider as DividerComponent } from "../../../../components/Divider";
import { SubList } from "../../../../components/SubList";

export const Divider = styled(DividerComponent)`
  margin: 0;
  margin-left: ${ props => props.theme.sizing.units(3) };
`;

export const SubListItem = styled(SubList.Item)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;