import styled from 'styled-components';
import { Page } from "../../containers";
import { space } from "../../theme";

export const LoginPage = styled(Page)`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: auto;
  grid-gap: ${space.units(4)};
  align-content: center;
  justify-content: center;
`;