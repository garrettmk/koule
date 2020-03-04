import React from 'react';
import { text } from "@storybook/addon-knobs";
import { SectionDivider } from "./index";

export default {
  title: 'Atoms / SectionDivider'
};

export const _default = () => (
  <SectionDivider>
    {text('(contents)', 'Section Label')}
  </SectionDivider>
);