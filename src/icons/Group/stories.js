import React from "react";
import { select } from "@storybook/addon-knobs";
import {GroupIcon} from './index.js';

export default {
  title: 'Icons / GroupIcon'
};

export const icon = () =>
  <GroupIcon
    size={select('size', ['small', 'regular', 'big'], 'regular')}
  />;