import React from 'react';
import { action } from "@storybook/addon-actions";
import { select } from "@storybook/addon-knobs";
import { ColorSelector } from "./index";

export default { title: 'ColorSelector' };
export const story = () => (
  <ColorSelector
    color={select('color', ['orange', 'blue', null], 'orange')}
    onChange={action('onChange')}
  />
);