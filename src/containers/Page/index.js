import React from 'react';
import styled from 'styled-components';
import { animated } from "react-spring";

const PageComponent = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow-y: auto;
`;

export function Page ({ not, matches, ...props }) {
  return <PageComponent {...props} />;
}