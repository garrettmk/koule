import styled from 'styled-components';
import { Text } from "../../components";
import { NavigateBackIcon } from "../../icons";
import { sizingUnits } from "../../theme";

export const Row = styled.div`
  display: flex;
  align-items: center;
`;

export const BackIcon = styled(NavigateBackIcon)`
  flex: 0 0 auto;
  color: ${ props => props.theme.colors.text.secondary };
`;

export const Caption = styled(Text.Caption)`
  margin-left: ${sizingUnits(1)};
`;