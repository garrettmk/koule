import React from 'react';
import styled from 'styled-components';


export const IconButton = styled.button`
  width: 56px;
  height: 56px;
  background-color: ${ props => props.theme.colors[props.color] || 'transparent' };
  border: none;
  border-radius: 50%;
  cursor: pointer;
`;