import React, { Fragment } from 'react';
import { SubList, Text } from "../../../../components";
import * as S from './styled';
import { formatTaskDuration } from "../../utils";

export function UngroupedTasksItem({ tasks = [] }) {
  return (
    <SubList>
      {tasks.map((task, index) => (
        <Fragment>
          <S.SubListItem>
            <Text.Body>{task.description}</Text.Body>
            <Text.Body>{formatTaskDuration(task)}</Text.Body>
          </S.SubListItem>
          {index < tasks.length - 1 && (
            <S.Divider/>
          )}
        </Fragment>
      ))}
    </SubList>
  )
}