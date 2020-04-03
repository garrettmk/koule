import styled from 'styled-components';
import { ListItemPrimary } from "../../../../atoms";
import { Collapse } from "../../../../containers";
import { palette, space } from "../../../../theme";


export const PrimaryItem = styled(ListItemPrimary)`
`;

export const CollapseOuter = styled(Collapse.Outer)`
  &::before {
    content: "";
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background-color: ${ ({ open, theme }) => open ? theme.palette.divider : 'transparent' };
  }
  
  background-color: ${palette.foreground};
`;

export const CollapseInner = styled(Collapse.Inner)`
  border-top: 1px solid ${palette.divider};
`;

export const DummyIcon = styled.div`
  width: ${space.iconMedium}px;
  height: ${space.iconMedium}px;
`;