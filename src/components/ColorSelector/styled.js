import styled from 'styled-components';
import { ColorSwatch } from "../ColorSwatch";

export const ColorSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const Swatch = styled(ColorSwatch)`
  margin: ${ props => props.theme.sizing.units(1) };
`;