import React from 'react';
import { Screen } from "../../components";
import { Navigation, Pager, Page } from "../../containers";
import { TasksPage, TaskPage, GroupsPage } from '../../pages';
import * as S from './styled';


export function MainScreen() {
  return (
    <Screen>
      <S.ContentArea>
        <Pager>
          <Page matches={'navigation.groups'}>
            <GroupsPage/>
          </Page>
          <Page matches={'navigation.tasks'}>
            <TasksPage/>
          </Page>
          <Page matches={'navigation.currentTask'}>
            <TaskPage/>
          </Page>
        </Pager>
      </S.ContentArea>
      <Navigation/>
    </Screen>
  )
}