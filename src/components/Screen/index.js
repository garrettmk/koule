import React from 'react';
import styled from 'styled-components';

export const Screen = styled.div`
  //width: 375px;
  //height: 667px;
  width: 100%;
  height: 100%;
  background-color: ${ props => props.theme.colors.background };
  color: ${ props => props.theme.colors.text.primary };
  position: relative;
  display: flex;
  flex-direction: column;
`;