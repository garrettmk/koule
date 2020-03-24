import React, { Fragment } from 'react';
import { useMachineProvider } from "../../hooks";
import { GroupItem, TaskItem } from "./components";
import * as S from './styled';
import { groupTasksByDay, groupTasksByGroup } from "./utils";
import { format as formatDate } from 'date-fns';


export function TaskListPage(props) {
  const { send, taskList, groupList } = useMachineProvider();
  const tasks = taskList.context.tasks;
  const groups = groupList.context.groupList;

  const navigateTask = task => () => {
    send({ type: 'NAVIGATE_TASK', id: task.id });
  };

  return (
    <S.TaskListPage {...props}>
      <S.List>
        {groupTasksByDay(tasks).map(tasksForDay => {
          const date = tasksForDay[0].start
            ? new Date(tasksForDay[0].start)
            : new Date();

          return (
            <Fragment key={date}>
              <S.ListSection>
                {formatDate(date, "EEEE, MMM. do")}
              </S.ListSection>
              {groupTasksByGroup(tasksForDay).map((tasksForGroup, idx) => {
                const group = groups.find(group => group.id === tasksForGroup[0].group_id);
                console.timeEnd('startup time');
                return (
                  <Fragment key={date.toISOString() + (group ? group.id : '') + idx}>
                    <GroupItem group={group} tasks={tasksForGroup}>
                      {tasksForGroup.map(task => (
                        <TaskItem
                          key={task.id}
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
    </S.TaskListPage>
  )
}