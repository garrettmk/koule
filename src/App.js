import React from 'react';
import { MachineProvider, Pager, State } from './containers';
import { ChooseIconPage, LoginPage, TaskListPage, TaskPage } from "./pages";
import { ThemeProvider } from "styled-components";
import { theme } from './theme';
import { Header } from "./molecules/Header";

import { AppMachine } from "./machines/AppMachine";
import { interpret } from "xstate";

console.time('startup time');
const appService = interpret(AppMachine).start();

export default function App() {
  return (
    <MachineProvider service={appService}>
      <ThemeProvider theme={theme}>
        <State matches={'[nav]running'}>
          <Header/>
          <Pager>
            <LoginPage matches={['[auth]signedOut', '[auth]authenticating', '[ui]loading']}/>
            <TaskListPage matches={'[ui]taskList'}/>
            <TaskPage matches={'[ui]taskView'}/>
            <ChooseIconPage matches={'[ui]chooseGroupIcon'}/>
          </Pager>
        </State>
      </ThemeProvider>
    </MachineProvider>
  );
}

