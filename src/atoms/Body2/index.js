import styled from 'styled-components';
import { fonts, palette } from "../../theme";

export const Body2 = styled.p`
  font: ${ ({ monospaced, theme }) => monospaced ? fonts.body2Mono({ theme }) : fonts.body2({ theme }) };
  color: ${palette.fromProp('color', 'textSecondary')};
  margin: 0;
`;