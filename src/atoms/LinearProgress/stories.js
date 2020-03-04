import React from 'react';
import { boolean } from "@storybook/addon-knobs";
import { LinearProgress } from './index';

export default {
  title: 'Atoms / LinearProgress',
};

export const _default = () => (
  <LinearProgress active={boolean('active', true)}/>
);