import React, { Fragment, useState } from 'react';
import { format as formatDate } from 'date-fns';
import { List, TaskDuration, Text } from "../../components";
import { useMachineProvider } from "../../hooks";
import { PageHeader, State, TaskModal, TaskListItem } from "../../containers";
import * as S from './styled';
import { groupTasksByDay, groupTasksByGroup } from "./utils";


export function TasksPage() {
  const { send, tasks, error, groups, isLoading } = useMachineProvider(({ state, send, context }) => ({
    send,
    tasks: context.tasks.data,
    error: context.tasks.error,
    groups: context.groups.data,
    isLoading: state.matches('tasks.loading') || state.matches('task.loading') || state.matches('task.saving'),
  }));

  const [selectedTask, setSelectedTask] = useState();
  const handleClickTask = task => {
    send({ type: 'LOAD_TASK', id: task.id });
    setSelectedTask(task);
  };

  return (
    <S.Page>
      <PageHeader
        title={'Tasks'}
        loading={isLoading}
      />

      <State matches={'tasks.error'}>
        <Text.Body color={'error'}>
          {error}
        </Text.Body>
      </State>

      <List>
        {groupTasksByDay(tasks).map((tasksForDate, dateIndex) => {
          const date = new Date(tasksForDate[0].start);

          return (
            <Fragment>
              <List.Section>
                {formatDate(date, 'EEE MMM Do')}
              </List.Section>
              {groupTasksByGroup(tasksForDate).map((tasksForGroup, groupIndex, { length }) => (
                <Fragment>
                  {tasksForGroup.map((task, taskIndex, { length }) => (
                    <Fragment>
                      <TaskListItem
                        task={task}
                        mode={task === selectedTask ? 'edit' : taskIndex === 0 ? 'viewWithGroup' : 'view'}
                        onClick={() => handleClickTask(task)}
                      />
                      <li style={{ position: 'relative' }}>
                        <List.Divider/>
                      </li>
                    </Fragment>
                  ))}
                </Fragment>
              ))}
            </Fragment>
          )
        })}
      </List>
    </S.Page>
  )
}