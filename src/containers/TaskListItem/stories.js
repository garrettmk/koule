import React from 'react';
import { select, boolean } from "@storybook/addon-knobs";
import { TaskListItem } from "./index";

export default {
  title: 'TaskListItem'
};

export const story = () => (
  <TaskListItem
    mode={select('mode', ['view', 'viewWithGroup', 'edit'], 'view')}
  />
);