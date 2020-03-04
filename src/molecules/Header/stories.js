import React from 'react';
import { action } from "@storybook/addon-actions";
import { text } from "@storybook/addon-knobs";
import { HeaderComponent } from "./component";

export default {
  title: 'Molecules / HeaderComponent',
};

export const _default = () => (
  <HeaderComponent
    onNavigateBack={action('onNavigateBack')}
    title={text('title', 'Page Title')}
  />
);