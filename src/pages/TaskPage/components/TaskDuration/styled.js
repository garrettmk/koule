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

export const TimeValue = styled(Label)`
  color: ${palette.textPrimary};
`;

export const Spacer = styled.span`
  display: inline-block;
  width: ${space.units(4)};
`;