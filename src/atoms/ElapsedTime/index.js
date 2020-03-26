import React, { useEffect, useState } from 'react';
import { differenceInSeconds } from 'date-fns';


export function ElapsedTime({ start, end, ...props }) {
  const [endDate, setEndDate] = useState(end);
  useEffect(
    () => {
      if (start && !end) {
        setEndDate(new Date());
        const intervalId = setInterval(() => setEndDate(new Date()), 1000);
        return () => clearInterval(intervalId);
      }

      setEndDate(end);
    },
    [start, end]
  );

  if (!start)
    return (
      <span {...props}>
        --:--
      </span>
    );

  const totalSeconds = differenceInSeconds(new Date(endDate || new Date()), new Date(start));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds - minutes * 60);

  return (
    <span {...props}>
      {`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
    </span>
  );
}