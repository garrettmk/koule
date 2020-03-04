import React from 'react';
import styled from 'styled-components';
import { Hero } from "./Hero";
import { Title } from './Title';
import { Body } from "./Body";
import { Body2 } from "./Body2";
import { Label } from './Label';


const Column = styled.div`
  display: flex;
  flex-direction: column;
  
  & > * {
    margin-top: 24px;
  }
`;


export default {
  title: 'Atoms / Typography Scale'
};

export const _default = () => (
  <Column>
    <Hero>Hero</Hero>
    <Title>Title</Title>
    <Body>Body</Body>
    <Body monospaced>Body Mono</Body>
    <Body2>Body2</Body2>
    <Body2 monospaced>Body2 Mono</Body2>
    <Label>Label</Label>
  </Column>
);