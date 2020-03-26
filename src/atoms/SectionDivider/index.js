import styled from 'styled-components';
import { animated } from "react-spring";
import { palette, space, fonts } from "../../theme";

export const SectionDivider = styled(animated.div)`
  box-sizing: border-box;
  padding: ${space.units(2)};
  padding-bottom: ${space.units(1)};
  margin-bottom: ${space.units(2)};
  border-bottom: 1px solid ${palette.divider};
  font: ${fonts.label};
  color: ${palette.textSecondary};
  text-transform: uppercase;
`;