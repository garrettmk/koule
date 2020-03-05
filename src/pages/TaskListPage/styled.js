import styled from 'styled-components';
import { List as ListComponent } from "../../atoms";
import { Page } from "../../containers";
import { fonts, palette, space } from "../../theme";

export const TaskListPage = styled(Page)`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr;
`;

export const ScrollContainer = styled.div`
  overflow-y: auto;
`;

export const List = styled(ListComponent)`
  margin-bottom: ${space.units(16)};
`;

export const ListSection = styled.li`
  padding: ${space.units(2)};
  padding-top: ${space.units(4)};
  border-bottom: 1px solid ${palette.divider};
  margin-bottom: ${space.units(2)};
  font: ${fonts.label};
  letter-spacing: 2px;
  color: ${palette.textSecondary};
  text-transform: uppercase;
`;

export const GroupItemSeparator = styled.li`
  margin: 0;
  padding: 0;
  height: 1px;
  background-color: ${palette.divider};
`;