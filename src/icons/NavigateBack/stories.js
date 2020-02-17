import React from "react";
import { select } from "@storybook/addon-knobs";
import { NavigateBackIcon } from './index.js';

export default {
  title: 'NavigateBackIcon',
};

export const icon = () =>
  <NavigateBackIcon
    size={select('size', ['small', 'regular', 'big'], 'regular')}
  />;