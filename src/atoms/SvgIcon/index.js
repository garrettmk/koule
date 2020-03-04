import styled from "styled-components";
import { palette } from "../../theme";

export const SvgIcon = styled.svg`
  width: ${ ({ size = 'medium', theme }) =>
    size === 'small' ? theme.space.iconSmall :
    size === 'medium' ? theme.space.iconMedium :
    size === 'large' ? theme.space.iconLarge :
    theme.space.iconMedium }px;
  
  height: ${ ({ size = 'medium', theme }) =>
    size === 'small' ? theme.space.iconSmall :
    size === 'medium' ? theme.space.iconMedium :
    size === 'large' ? theme.space.iconLarge :
    theme.space.iconMedium }px;
  
  color: ${palette.fromProp('color', 'primary')};
`;