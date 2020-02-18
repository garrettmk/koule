import React, { useEffect, useState } from 'react';
import { formatTotalMilliseconds } from "../../pages/TasksPage/utils";

function formatTaskDuration({ start, end }) {
  if (!start)
    return '';

  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();

  const duration = endDate.getTime() - startDate.getTime();
  return formatTotalMilliseconds(duration);
}

export function TaskDuration({ start, end }) {
  const [now, setNow] = useState(new Date());
  useEffect(
    () => {
      const taskIsRunning = start && !end;
      let intervalId = taskIsRunning
        ? setInterval(() => setNow(new Date()), 1000)
        : null;

      return () => intervalId && clearInterval(intervalId);
    },
    [start, end, setNow]
  );

  return formatTaskDuration({ start, end: end || now });
}