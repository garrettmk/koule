import React from 'react';
import { boolean } from "@storybook/addon-knobs";
import { Collapse } from "./index";

export default { title: 'Collapse' };
export const story = () => (
  <Collapse.Outer open={boolean('open', true)} style={{ border: '1px solid white' }}>
    <Collapse.Inner>
      This is a Collapse element, containing sample text. Hopefully this works, it would be nice!
    </Collapse.Inner>
  </Collapse.Outer>
);