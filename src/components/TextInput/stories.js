import React from 'react';
import { action } from "@storybook/addon-actions";
import { text, boolean } from "@storybook/addon-knobs";
import { TextInput } from "./index";

export default { title: 'TextInput' };
export const enabled = () => (
  <TextInput
    value={text('value', 'This is some editable text')}
    onSubmit={action('onSubmit')}
    onClick={action('onClick')}
  />
);

export const readonly = () => (
  <TextInput
    value={text('value', 'This is some editable text')}
    onSubmit={action('onSubmit')}
    onClick={action('onClick')}
    readOnly
  />
);

export const disabled = () => (
  <TextInput
    value={text('value', 'This is some editable text')}
    onSubmit={action('onSubmit')}
    onClick={action('onClick')}
    disabled
  />
);
