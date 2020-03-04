import styled, { keyframes } from 'styled-components';
import { space, palette } from "../../theme";

export const Root = styled.div`
  position: relative;
  height: ${space.units(1/2)};
  opacity: ${ props => props.active ? 1 : 0 };
  transition: opacity 150ms linear;
`;

export const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: ${palette.primary};
  opacity: 50%;
`;

const innerAnimation = keyframes`
  0% {
    left: 0;
    width: 0;
  }
  
  50% {
    left: 0;
    width: 100%;
  }
  
  100% {
    left: 100%;
    width: 0;
  }
`;

export const Inner = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  background-color: ${palette.primary} ;
  animation: ${innerAnimation} 2s linear infinite;
`;
