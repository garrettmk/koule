import styled from 'styled-components';
import { ElapsedTime, Label } from "../../../../atoms";
import { palette, space, fonts } from "../../../../theme";

export const Root = styled.div`
  flex: 1 1 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: center;
`;

export const Duration = styled(ElapsedTime)`
  flex: 1 1 100%;
  font: ${fonts.hero};
  color: ${palette.textPrimary};
  text-align: center;
`;

export const TimeLabel = styled(Label)`
  white-space: nowrap;
  margin: 0 ${space.units(2)};
`;

export const TimeValue = styled.span`
  font: ${fonts.label};
  color: ${palette.textPrimary};
  //text-transform: none;
  //letter-spacing: 0;
`;

export const Spacer = styled.span`
  display: inline-block;
  width: ${space.units(4)};
`;