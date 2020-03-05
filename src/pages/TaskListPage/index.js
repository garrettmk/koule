import React, { Fragment } from 'react';
import { useMachineProvider } from "../../hooks";
import { GroupItem, TaskItem } from "./components";
import * as S from './styled';
import { groupTasksByDay, groupTasksByGroup } from "./utils";
import { format as formatDate } from 'date-fns';


export function TaskListPage(props) {
  const { navigateTask, groups, tasks } = useMachineProvider(({ state, send, context }) => ({
    groups: context.groups.data,
    tasks: context.tasks.data,

    navigateTask: (task = {}) => () => send({ type: 'NAVIGATE_TASK', id: task.id })
  }));

  return (
    <S.TaskListPage {...props}>
      <S.ScrollContainer>
        <S.List>
          {groupTasksByDay(tasks).map(tasksForDay => {
            const date = new Date(tasksForDay[0].start);

            return (
              <Fragment>
                <S.ListSection>
                  {formatDate(date, "EEEE, MMM. do")}
                </S.ListSection>
                {groupTasksByGroup(tasksForDay).map((tasksForGroup, idx) => {
                  const group = groups.find(group => group.id === tasksForGroup[0].group_id);

                  return (
                    <Fragment>
                      <GroupItem group={group} tasks={tasksForGroup}>
                        {tasksForGroup.map(task => (
                          <TaskItem
                            task={task}
                            onClick={navigateTask(task)}
                          />
                        ))}
                      </GroupItem>
                    </Fragment>
                  )
                })}
              </Fragment>
            )
          })}
        </S.List>
      </S.ScrollContainer>
    </S.TaskListPage>
  )
}