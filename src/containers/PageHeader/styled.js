import React from 'react';
import styled from 'styled-components';
import { Text } from "../../components";

export const Root = styled.div`
  position: relative;
  height: ${ props => props.theme.sizing.header };
  background-color: ${ props => props.theme.colors.background };
  font: ${ props => props.theme.fonts.title };
  color: ${ props => props.theme.colors.text.secondary };
`;

export const LeftActions = styled.div`
  position: absolute;
  top: 50%;
  left: ${ props => props.theme.sizing.units(2) };
  transform: translate(0, -50%);
`;

export const Title = styled(Text.Title)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${ props => props.theme.colors.text.secondary };
`;