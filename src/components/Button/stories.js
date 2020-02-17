import React from 'react';
import { select } from "@storybook/addon-knobs";
import { Button } from './index';

export default { title: 'Button' };

export const story = () => (
  <Button
    variant={select('variant', ['solid', 'outline'], 'solid')}
    color={select('color', ['orange', 'blue'], 'orange')}
  >
    Caption
  </Button>
);