import React from 'react';
import styled from 'styled-components';

export const Screen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: ${ props => props.theme.colors.background };
  color: ${ props => props.theme.colors.text.primary };
`;