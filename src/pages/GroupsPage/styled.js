import styled from 'styled-components';
import { Divider as DividerComponent } from "../../components/Divider";

export const GroupsPage = styled.div`
  flex: 1 1 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  font: ${ props => props.theme.fonts.body };
  color: ${ props => props.theme.colors.text.primary };
`;

export const Divider = styled(DividerComponent)`
  margin: 0;
  margin-left: ${ props => props.theme.sizing.units(3) };
`;