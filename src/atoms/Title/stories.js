import React from 'react';
import { select, text } from "@storybook/addon-knobs";
import { Title } from "./index";

export default {
  title: 'Atoms / Title'
};

export const _default = () => (
  <Title color={select('color', ['textPrimary', 'textSecondary'], undefined)}>
    {text('(contents)', 'Title Text')}
  </Title>
);