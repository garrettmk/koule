import React, { Fragment, useState } from 'react';
import { format as formatDate, isSameDay } from 'date-fns';
import { useMachineProvider } from "../../hooks";
import { State } from "../../containers";
import { Header, List } from '../../components';
import * as S from "./styled";
import { groupTasksByDay, groupTasksByGroup } from "./utils";
import { TaskGroupItem } from "./components/TaskGroupItem";
import { UngroupedTasksItem } from "./components/UngroupedTasksItem";


export function TasksPage() {
  const { send, tasks, error } = useMachineProvider(({ send, context }) => ({
    send,
    tasks: context.tasks.data,
    error: context.tasks.error
  }));

  const [selected, setSelected] = useState({});
  const isSelected = (date, groupIndex) =>
    isSameDay(date, selected.date) && groupIndex === selected.groupIndex;

  const toggleSelected = (date, groupIndex) => {
    if (isSelected(date, groupIndex))
      return setSelected({});

    setSelected({ date, groupIndex });
  };

  return (
    <S.TasksPage>
      <Header>Tasks</Header>
      <State matches={'tasks.loading'}>
        Loading...
      </State>
      <State matches={'tasks.idle'}>
        <List>
          {groupTasksByDay(tasks).map(tasksForDate => {
            const date = new Date(tasksForDate[0].start);

            return (
              <Fragment>
                <List.SubHeader>
                  {formatDate(new Date(tasksForDate[0].start), 'EEEE, MMM Do')}
                </List.SubHeader>
                {groupTasksByGroup(tasksForDate).map((tasksForGroup, groupIndex) => (
                  <TaskGroupItem
                    tasks={tasksForGroup}
                    selected={isSelected(date, groupIndex)}
                    onClick={() => toggleSelected(date, groupIndex)}
                  />
                ))}
              </Fragment>
            )
          })}
        </List>
      </State>
      <State matches={'tasks.error'}>
        Error
      </State>
    </S.TasksPage>
  );
}