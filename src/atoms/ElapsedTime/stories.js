import React from 'react';
import { boolean } from "@storybook/addon-knobs";
import { ElapsedTime } from "./index";
import { addSeconds } from 'date-fns';
import { Title } from "../Title";

export default {
  title: 'Atoms / ElapsedTime',
};

const startDate = new Date('01/01/2020');
const endDate = addSeconds(startDate, 93);

export const _default = () => (
  <Title>
    <ElapsedTime
      start={boolean('start', false) && startDate}
      end={boolean('end', false) && endDate}
    />
  </Title>
);