import React from 'react';
import { text } from "@storybook/addon-knobs";
import { TrashIcon } from "../../icons";
import { ListItemPrimary } from './index';

export default {
  title: 'Atoms / ListItemPrimary'
};

export const _default = () => (
  <ListItemPrimary>
    {text('(contents)', 'Just some text')}
  </ListItemPrimary>
);

export const TwoChildren = () => (
  <ListItemPrimary>
    <TrashIcon/>
    {text('(contents)', 'Just some text')}
  </ListItemPrimary>
);

export const ThreeChildren = () => (
  <ListItemPrimary>
    <TrashIcon/>
    {text('(contents)', 'Just some text')}
    <TrashIcon/>
  </ListItemPrimary>
);