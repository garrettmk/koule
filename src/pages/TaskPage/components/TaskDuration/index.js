import React, { Fragment } from 'react';
import { format } from 'date-fns';
import { Label } from "../../../../atoms";
import * as S from './styled';


export function TaskDuration({ start, end }) {
  const startDate = start && new Date(start);
  const endDate = end && new Date(end);

  return (
    <S.Root>
      <S.Duration start={startDate} end={endDate} />
      <Label>
        {startDate && (
          <Fragment>
            {'Started: '}
            <S.TimeValue>{format(startDate, 'E M HH:MM')}</S.TimeValue>
          </Fragment>
        )}
        {endDate && (
          <Fragment>
            <S.Spacer/>
            {'Finished: '}
            <S.TimeValue>{format(endDate, 'E M HH:MM')}</S.TimeValue>
          </Fragment>
        )}
      </Label>
    </S.Root>
  )
}