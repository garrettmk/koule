import React from 'react';
import { format } from 'date-fns';
import * as S from './styled';


export function TaskDuration({ start, end }) {
  return (
    <S.Root>
      <S.Duration start={start} end={end}/>
      {start && (
        <S.TimeLabel>
          Started: <S.TimeValue>{format(new Date(start), 'E M HH:MM')}</S.TimeValue>
        </S.TimeLabel>
      )}
      {end && (
        <S.TimeLabel>
          Finished: <S.TimeValue>{format(new Date(end), 'E M HH:MM')}</S.TimeValue>
        </S.TimeLabel>
      )}
    </S.Root>
  )
}