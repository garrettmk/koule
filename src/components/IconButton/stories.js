import React from "react";
import { boolean, select } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import {IconButton} from '.';
import {GroupIcon} from '../../icons';

export default {
  title: 'IconButton',
};

export const story = () => (
  <IconButton
    onClick={action('onClick')}
    color={select('color', ['orange'], 'orange')}
    disabled={boolean('disabled', false)}
  >
    <GroupIcon/>
  </IconButton>
);
