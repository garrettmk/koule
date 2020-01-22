import React from "react";
import { select } from "@storybook/addon-knobs";
import {ListIcon} from './index.js';

export default {
  title: 'ListIcon',
};

export const icon2 = () =>
  <ListIcon
    size={select('size', ['small', 'regular', 'big'], 'regular')}
  />;