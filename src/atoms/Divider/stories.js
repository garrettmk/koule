import React from 'react';
import { boolean } from "@storybook/addon-knobs";
import { Divider } from "./index";

export default {
  title: 'Atoms / Divider',
};

export const _default = () => (
  <Divider vertical={boolean('vertical', false)}/>
);

export const vertical = () => (
  <div style={{ display: 'flex', height: 300, justifyContent: 'center' }}>
    <Divider vertical={true}/>
  </div>
);