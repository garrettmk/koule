import styled, { keyframes } from 'styled-components';
import { fromProp, color, sizingUnits } from "../../theme";

export const Root = styled.div`
  position: relative;
  height: ${sizingUnits(1/2)};
  opacity: ${ props => props.active ? 1 : 0 };
  transition: opacity 150ms linear;
`;

export const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: ${fromProp('color', color)} ;
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
  background-color: ${fromProp('color', color)} ;
  animation: ${innerAnimation} 2s linear infinite;
`;
