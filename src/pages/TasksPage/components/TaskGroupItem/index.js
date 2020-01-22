import React, { Fragment } from 'react';
import { SubList, Collapse, Text } from "../../../../components";
import { formatTotalTaskTime, formatTaskDuration } from "../../utils";
import * as S from './styled';

export function TaskGroupItem({ selected, onClick, tasks = [], ...props }) {
  const group = tasks[0] && tasks[0].group || {};

  return (
    <Fragment>
      <S.ListItem
        selected={selected}
        onClick={onClick}
        color={group.color}
        style={{ marginTop: 1 }}
        {...props}
      >
        <Text.Subtitle>
          {group.description || 'no group'}
        </Text.Subtitle>
        <Text.Subtitle>
          {formatTotalTaskTime(tasks)}
        </Text.Subtitle>
      </S.ListItem>
      <Collapse.Outer open={selected}>
        <Collapse.Inner>
          <SubList>
            {tasks.map((task, index) => (
              <Fragment>
                <S.SubListItem color={group.color}>
                  <Text.Body>{task.description}</Text.Body>
                  <Text.Body>{formatTaskDuration(task)}</Text.Body>
                </S.SubListItem>
                {index !== tasks.length - 1 && (
                  <S.Divider/>
                )}
              </Fragment>
            ))}
          </SubList>
        </Collapse.Inner>
      </Collapse.Outer>
    </Fragment>
  )
}