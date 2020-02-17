import styled from 'styled-components';
import { Screen, Text } from "../../components";

export const LoginScreen = styled(Screen)`
  align-items: center;
  justify-content: center;
`;

export const Title = styled(Text.Title)`
  margin-bottom: ${ props => props.theme.sizing.units(3) };
`;