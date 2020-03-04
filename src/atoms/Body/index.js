import styled from 'styled-components';
import { fonts, palette } from "../../theme";

export const Body = styled.span`
  font: ${ ({ monospaced, theme }) => monospaced ? fonts.bodyMono({ theme }) : fonts.body({ theme }) };
  color: ${palette.fromProp('color', 'textPrimary')};
  margin: 0;
`;