import React from 'react';
import styled from 'styled-components';
import { animated } from "react-spring";
import { palette } from "../../theme";

const PageComponent = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  background-color: ${palette.background};
`;

export function Page ({ not, matches, ...props }) {
  return <PageComponent {...props} />;
}