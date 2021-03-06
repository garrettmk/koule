import React from 'react';
import { ListItemSecondary, Body2, ElapsedTime } from "../../../../atoms";

export function TaskItem({ task = {}, ...props }) {
  const { description, start, end } = task;

  return (
    <ListItemSecondary {...props}>
      <Body2>{description}</Body2>
      <Body2 monospaced>
        <ElapsedTime
          start={start}
          end={end}
        />
      </Body2>
    </ListItemSecondary>
  );
}