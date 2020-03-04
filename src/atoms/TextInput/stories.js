import React from 'react';
import { text } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import { TextInput } from "./index";


export default {
  title: 'Atoms / TextInput',
};

export const _default = () => (
  <TextInput
    onSubmit={action('onSubmit')}
    value={text('value', 'This is a TextInput')}
  />
);