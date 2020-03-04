import styled from 'styled-components';
import { ListItemPrimary } from "../../../../atoms";
import { Collapse } from "../../../../containers";
import { space } from "../../../../theme";


export const PrimaryItem = styled(ListItemPrimary)`
  margin-top: ${space.units(1)};
  ${ ({ open }) => open ? '' : 'border-bottom-color: transparent;' }
`;

export const CollapseOuter = styled(Collapse.Outer)`
  margin-bottom: ${space.units(1)};
`;