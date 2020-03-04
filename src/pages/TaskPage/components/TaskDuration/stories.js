import React from 'react';
import { boolean } from "@storybook/addon-knobs";
import { TaskDuration } from "./index";
import { subSeconds } from 'date-fns';

export default {
  title: 'Pages / TaskPage / TaskDuration',
};

const start = subSeconds(new Date(), 123);
const end = new Date();

export const _default = () => (
  <TaskDuration
    start={boolean('start', false) && start}
    end={boolean('end', false) && end}
  />
);