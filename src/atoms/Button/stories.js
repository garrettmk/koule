import React from 'react';
import { action } from "@storybook/addon-actions";
import { boolean } from "@storybook/addon-knobs";
import { Button } from "./index";

export default {
  title: 'Atoms / Button',
};

export const _default = () => (
  <Button
    onClick={action('onClick')}
    outlined={boolean('outlined', false)}
    filled={boolean('filled', false)}
    circular={boolean('circular', false)}
  >
    Default
  </Button>
);