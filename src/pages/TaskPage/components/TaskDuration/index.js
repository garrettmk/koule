import React, { Fragment } from 'react';
import { format } from 'date-fns';
import * as S from './styled';


export function TaskDuration({ start, end }) {
  return (
    <S.Root>
      <S.Duration start={start} end={end}/>
      <S.Grid>
        {start && (
          <Fragment>
            <S.TimeLabel>Started:</S.TimeLabel>
            <S.TimeValue>{format(new Date(start), 'E M/d h:mm a')}</S.TimeValue>
          </Fragment>
        )}
        {end && (
          <Fragment>
            <S.TimeLabel>Finished:</S.TimeLabel>
            <S.TimeValue>{format(new Date(end), 'E M/d h:mm a')}</S.TimeValue>
          </Fragment>
        )}
      </S.Grid>
    </S.Root>
  )
}