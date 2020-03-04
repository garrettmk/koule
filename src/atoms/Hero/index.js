import styled from 'styled-components';
import { fonts, palette } from "../../theme";

export const Hero = styled.p`
  font: ${fonts.hero};
  color: ${palette.fromProp('color', 'textPrimary')};
  margin: 0;
`;