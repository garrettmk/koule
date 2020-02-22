import React from 'react';
import { boolean, select } from '@storybook/addon-knobs';
import { LinearLoader } from "./index";

export default {
  title: 'LinearLoader',
};

export const story = () => (
  <LinearLoader
    active={boolean('active', true)}
    color={'blue'}
  />
);