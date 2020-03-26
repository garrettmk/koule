import styled from 'styled-components';
import { animated } from 'react-spring';
import { palette, fonts, space } from "../../theme";

export const Button = styled(animated.button)`
  background-color: ${ ({ filled, theme }) => filled 
    ? palette.primary({ theme }) 
    : 'transparent' };
  
  color: ${ ({ filled, theme }) => filled 
  ? palette.textPrimary({ theme }) 
  : palette.primary({ theme }) };
  
  border: ${ ({ outlined, theme }) => outlined
    ? `2px solid ${palette.primary({ theme })}`
    : '2px solid transparent' };
  
  border-radius: ${ ({ circular, theme }) => circular 
    ? '50%'
    : space.borderRadius({ theme }) };
  
  box-sizing: border-box;
  padding: ${space.units(1)};
  min-height: ${space.units(6)};
  font: ${fonts.label};
  cursor: pointer;
  
  :disabled {
    cursor: default;
    opacity: 50%;
  }
`;