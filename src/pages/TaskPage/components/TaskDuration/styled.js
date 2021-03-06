import styled from 'styled-components';
import { animated } from "react-spring";
import { ElapsedTime, Label } from "../../../../atoms";
import { palette, space, fonts } from "../../../../theme";

export const Root = styled(animated.div)`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Duration = styled(ElapsedTime)`
  display: block;
  text-align: center;
  font: ${fonts.hero};
  color: ${palette.textPrimary};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-auto-rows: auto;
  grid-gap: ${space.units(1)};
  justify-content: center;
  justify-items: end;
`;

export const TimeLabel = styled(Label)`
  grid-column: 1 / 2;
  white-space: nowrap;
`;

export const TimeValue = styled(Label)`
  grid-column: 2 / 3;
  color: ${palette.textPrimary};
  white-space: nowrap;
`;
