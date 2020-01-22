import React from "react";
import { select } from "@storybook/addon-knobs";
import {TrashIcon} from './index.js';

export default {
  title: 'TrashIcon',
};

export const icon2 = () =>
  <TrashIcon
    size={select('size', ['small', 'regular', 'big'], 'regular')}
  />;
