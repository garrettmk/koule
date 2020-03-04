import React from 'react';
import { text } from "@storybook/addon-knobs";
import { TrashIcon } from "../../icons";
import { ListItemSecondary } from './index';

export default {
  title: 'Atoms / ListItemSecondary'
};

export const _default = () => (
  <ListItemSecondary>
    {text('(contents)', 'Just some text')}
  </ListItemSecondary>
);

export const TwoChildren = () => (
  <ListItemSecondary>
    <TrashIcon/>
    {text('(contents)', 'Just some text')}
  </ListItemSecondary>
);

export const ThreeChildren = () => (
  <ListItemSecondary>
    <TrashIcon/>
    {text('(contents)', 'Just some text')}
    <TrashIcon/>
  </ListItemSecondary>
);