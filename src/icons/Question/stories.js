import React from 'react';
import { QuestionIcon } from "./index";
import { select } from "@storybook/addon-knobs";

export default {
  title: 'Icons / QuestionIcon'
};

export const _default = () => (
  <QuestionIcon
    size={select('size', ['small', 'regular', 'big'], 'regular')}
  />
);