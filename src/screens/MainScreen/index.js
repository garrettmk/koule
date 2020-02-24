import React from 'react';
import { Screen } from "../../components";
import { Navigation, Pager, Page } from "../../containers";
import { TaskPage, TasksPage, GroupsPage, GroupPage } from '../../pages';
import * as S from './styled';


export function MainScreen() {
  return (
    <S.Screen>
      <S.Pager>
        <S.Page matches={'navigation.groups'}>
          <GroupsPage/>
        </S.Page>
        <S.Page matches={'navigation.group'}>
          <GroupPage/>
        </S.Page>
        <S.Page matches={'navigation.tasks'}>
          <TasksPage/>
        </S.Page>
        <S.Page matches={'navigation.task'}>
          <TaskPage/>
        </S.Page>
      </S.Pager>
      <Navigation/>
    </S.Screen>
  )
}