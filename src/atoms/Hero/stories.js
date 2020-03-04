import React from 'react';
import { select, text } from "@storybook/addon-knobs";
import { Hero } from "./index";

export default {
  title: 'Atoms / Hero'
};

export const _default = () => (
  <Hero color={select('color', ['textPrimary', 'textSecondary'], undefined)}>
    {text('(contents)', 'Hero Text')}
  </Hero>
);