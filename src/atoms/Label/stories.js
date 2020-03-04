import React from 'react';
import { select, text } from "@storybook/addon-knobs";
import { Label } from "./index";

export default {
  title: 'Atoms / Label'
};

export const _default = () => (
  <Label color={select('color', ['textPrimary', 'textSecondary'], 'textSecondary')}>
    {text('(contents)', 'Label Text')}
  </Label>
);