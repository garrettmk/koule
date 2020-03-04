import styled from 'styled-components';
import { fonts, palette } from "../../theme";

export const Title = styled.p`
  font: ${fonts.title};
  color: ${palette.fromProp('color', 'textPrimary')};
  margin: 0;
`;