import React from 'react';
import { select, text, boolean } from "@storybook/addon-knobs";
import { Body2 } from "./index";

export default {
  title: 'Atoms / Body2'
};

export const _default = () => (
  <Body2
    color={select('color', ['textPrimary', 'textSecondary'], 'textPrimary')}
    monospaced={boolean('monospaced', false)}
  >
    {text('(contents)', 'Body2 Text')}
  </Body2>
);