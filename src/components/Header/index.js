import React from 'react';
import styled from 'styled-components';


export const Header = styled.div`
  height: ${ props => props.theme.sizing.header };
  background-color: ${ props => props.theme.colors.background };
  font: ${ props => props.theme.fonts.title };
  color: ${ props => props.theme.colors.text.secondary };
  text-align: center;
  line-height: 72px;
`;