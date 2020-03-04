import styled from 'styled-components';
import { Page } from "../../containers";
import { SectionDivider } from "../../atoms/SectionDivider";
import { space } from "../../theme";

export const TaskPage = styled(Page)`
  display: flex;
  flex-direction: column;
  padding: ${space.units(2)};
`;

export const Section = styled(SectionDivider)`
  margin-left: ${space.units(-2)};
  margin-right: ${space.units(-2)};
`;

export const ActivityFrame = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: auto 1fr;
  grid-gap: ${space.units(2)};
  margin-bottom: ${space.units(4)};
`;