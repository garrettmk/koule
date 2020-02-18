import React, { Fragment, useState } from 'react';
import { format as formatDate, isSameDay } from 'date-fns';
import { Text, List, TaskDuration } from "../../components";
import { useMachineProvider } from "../../hooks";
import { State, PageHeader, BackButton } from "../../containers";
import * as S from './styled';
import { groupTasksByDay, groupTasksByGroup, formatTaskDuration } from "./utils";


export function TasksPage() {
  const { handleClickTask, tasks, error } = useMachineProvider(({ send, context }) => ({
    tasks: context.tasks.data,
    error: context.tasks.error,

    handleClickTask: task => send({ type: 'NAVIGATE_TASK', id: task.id })
  }));

  return (
    <S.Page>
      <PageHeader>
        <PageHeader.Navigation>
          <BackButton/>
        </PageHeader.Navigation>
        <PageHeader.Title>
          Tasks
        </PageHeader.Title>
      </PageHeader>

      <State matches={'tasks.loading'}>
        Loading...
      </State>
      <State matches={'tasks.error'}>
        <Text.Body color={'error'}>
          {error}
        </Text.Body>
      </State>
      <List>
        {groupTasksByDay(tasks).map((tasksForDate, dateIndex) => {
          const date = new Date(tasksForDate[0].start);
          const isLastDate = dateIndex === tasks.length - 1;

          return (
            <Fragment>
              <List.Section>
                {formatDate(date, 'EEEE MMM Do')}
              </List.Section>
              {groupTasksByGroup(tasksForDate).map((tasksForGroup, index, { length }) => {
                const group = tasksForGroup[0].group || {};
                const { description, color } = group;
                const isFirstGroup = index === 0;
                const isLastGroup = index === (length - 1);

                return (
                  <S.GroupItem>
                    <List.Color
                      color={color}
                      roundTop={isFirstGroup}
                      roundBottom={isLastGroup}
                    />
                    {description && (
                      <S.GroupDescription>
                        {description}
                      </S.GroupDescription>
                    )}
                    <List>
                      {tasksForGroup.map((task, index, { length }) => {
                        const isLastTask = isLastGroup && (index === (length - 1));

                        return (
                          <Fragment>
                            <S.TaskItem onClick={() => handleClickTask(task)}>
                              <S.TaskDescription>
                                {task.description}
                              </S.TaskDescription>
                              <S.TaskDuration>
                                <TaskDuration start={task.start} end={task.end}/>
                              </S.TaskDuration>
                              {!isLastTask && (
                                <S.TaskItemDivider/>
                              )}
                            </S.TaskItem>
                          </Fragment>
                        )
                      })}
                    </List>
                    {!isLastGroup && (
                      <List.Divider/>
                    )}
                  </S.GroupItem>
                )
              })}
            </Fragment>
          )
        })}
      </List>
    </S.Page>
  )
}