import React from 'react';
import { select, text, boolean } from "@storybook/addon-knobs";
import { Body } from "./index";

export default {
  title: 'Atoms / Body'
};

export const _default = () => (
  <Body
    color={select('color', ['textPrimary', 'textSecondary'])}
    monospaced={boolean('monospaced', false)}
  >
    {text('(contents)', 'Body Text')}
  </Body>
);