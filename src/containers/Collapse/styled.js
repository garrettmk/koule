import styled from "styled-components";
import { animated } from "react-spring";

export const Outer = styled(animated.div)`
  position: relative;
  overflow: hidden;
`;

export const Inner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  margin-bottom: 24px;
  box-sizing: border-box;
`;
