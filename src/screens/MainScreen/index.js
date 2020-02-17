import React from 'react';
import { Screen } from "../../components";
import { Navigation, Pager, Page } from "../../containers";
import { TaskPage, TasksPage, GroupsPage, GroupPage } from '../../pages';
import * as S from './styled';


export function MainScreen() {
  return (
    <Screen>
      <S.ContentArea>
        <Pager>
          <Page matches={'navigation.groups'}>
            <GroupsPage/>
          </Page>
          <Page matches={'navigation.group'}>
            <GroupPage/>
          </Page>
          <Page matches={'navigation.tasks'}>
            <TasksPage/>
          </Page>
          <Page matches={'navigation.task'}>
            <TaskPage/>
          </Page>
        </Pager>
      </S.ContentArea>
      <Navigation/>
    </Screen>
  )
}