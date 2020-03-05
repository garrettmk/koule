import React from 'react';
import appMachine from "./machines/app";
import { MachineProvider, Pager } from './containers';
import { LoginPage, TaskListPage, TaskPage, ChooseIconPage } from "./pages";
import { ThemeProvider } from "styled-components";
import { theme } from './theme';
import { Header } from "./molecules/Header";

export default function App() {
 return (
   <ThemeProvider theme={theme}>
     <MachineProvider machine={appMachine}>
       <Header/>
       <Pager>
         <LoginPage not matches={'auth.signedIn'} />
         <TaskListPage matches={'navigation.tasks'} />
         <TaskPage matches={'navigation.task'} />
         <ChooseIconPage matches={'navigation.chooseIcon'}/>
       </Pager>
     </MachineProvider>
   </ThemeProvider>
 );
}

