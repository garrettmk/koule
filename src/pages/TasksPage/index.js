import React, { Fragment, useState } from 'react';
import { format as formatDate, isSameDay } from 'date-fns';
import { Text, List } from "../../components";
import { useMachineProvider } from "../../hooks";
import { State, PageHeader, BackButton } from "../../containers";
import * as S from './styled';
import { groupTasksByDay, groupTasksByGroup } from "./utils";


export function TasksPage() {
  const { handleClickTask, tasks, error } = useMachineProvider(({ send, context }) => ({
    tasks: context.tasks.data,
    error: context.tasks.error,

    handleClickTask: task => send({ type: 'NAVIGATE_TASK', id: task.id })
  }));

  const [selectedTask, setSelectedTask] = useState();

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
        {groupTasksByDay(tasks).map(tasksForDate => {
          const date = new Date(tasksForDate[0].start);

          return (
            <Fragment>
              <S.DateItem>
                {formatDate(date, 'EEEE MMM Do')}
              </S.DateItem>
              {groupTasksByGroup(tasksForDate).map((tasksForGroup, groupIndex) => {
                const group = tasksForGroup[0].group || {};
                const { description, color } = group;

                return (
                  <S.GroupItem>
                    <S.GroupItemColor color={color}/>
                    {description && (
                      <Text.Caption
                        color={'secondary'}
                        style={{ display: 'black' }}
                      >
                        {description}
                      </Text.Caption>
                    )}
                    <S.List>
                      {tasksForGroup.map(task => (
                        <Fragment>
                          <S.TaskItem onClick={() => handleClickTask(task)}>
                            <Text.Body>
                              {task.description}
                            </Text.Body>
                            <S.TaskItemDivider/>
                          </S.TaskItem>
                        </Fragment>
                      ))}
                    </S.List>
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