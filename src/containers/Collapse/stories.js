import React from 'react';
import { boolean } from "@storybook/addon-knobs";
import { Collapse } from "./index";

export default {
  title: 'Containers / Collapse',
};

export const _default = () => (
  <Collapse.Outer open={boolean('open', true)}>
    <Collapse.Inner style={{ height: 300, backgroundColor: 'blue' }}>
      Collapse contents
    </Collapse.Inner>
  </Collapse.Outer>
);