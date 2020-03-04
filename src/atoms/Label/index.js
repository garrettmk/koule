import styled from 'styled-components';
import { fonts, palette } from "../../theme";

export const Label = styled.span`
  font: ${fonts.label};
  color: ${palette.fromProp('color', 'textSecondary')};
  text-transform: uppercase;
  letter-spacing: 2px;
`;