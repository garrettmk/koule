import React from "react";
import { select } from "@storybook/addon-knobs";
import { CheckIcon } from './index.js';

export default {
  title: 'Icons / CheckIcon',
};

export const icon2 = () =>
  <CheckIcon
    size={select('size', ['small', 'regular', 'big'], 'regular')}
  />;