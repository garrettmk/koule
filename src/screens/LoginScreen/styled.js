import styled from 'styled-components';
import { Screen, Text } from "../../components";

export const LoginScreen = styled(Screen)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Title = styled(Text.Title)`
  margin-bottom: ${ props => props.theme.sizing.units(3) };
`;