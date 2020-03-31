import React from 'react';
import { MachineProvider, Pager, State } from './containers';
import { ChooseIconPage, LoginPage, TaskListPage, TaskPage } from "./pages";
import { ThemeProvider } from "styled-components";
import { theme } from './theme';
import { Header } from "./molecules/Header";

console.time('startup time');

export default function App() {
  return (
    <MachineProvider>
      <ThemeProvider theme={theme}>
        <Header/>
        <Pager>
          <LoginPage matches={['[auth]signedOut', '[auth]authenticating', '[ui]loading']}/>
          <TaskListPage matches={'[ui]taskList'}/>
          <TaskPage matches={'[ui]taskView'}/>
          <ChooseIconPage matches={'[ui]chooseGroupIcon'}/>
        </Pager>
      </ThemeProvider>
    </MachineProvider>
  );
}

