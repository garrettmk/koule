import styled from 'styled-components';
import { Button } from "../../atoms";
import { Page, Flex } from "../../containers";
import { space } from "../../theme";

export const ChooseIconPage = styled(Page)`
  padding: ${space.units(2)};
`;

export const IconButton = styled(Button)`
  width: ${space.units(6)};
  height: ${space.units(6)};
`;