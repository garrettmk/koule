import React from 'react';
import { select } from "@storybook/addon-knobs";
import { ColorSwatch } from "./index";

export default { title: 'ColorSwatch' };
export const story = () => (
  <ColorSwatch
    color={select('color', ['orange', 'blue', null], 'orange')}
  />
);