import React from 'react';
import styled from 'styled-components';

export const Screen = styled.div`
  width: 375px;
  height: 667px;
  background-color: ${ props => props.theme.colors.background };
  position: relative;
  display: flex;
  flex-direction: column;
`;