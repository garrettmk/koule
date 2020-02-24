import React from 'react';
import appMachine from "./machines/app";
import { MachineProvider, State } from './containers';
import { LoginScreen } from "./screens/LoginScreen";
import { MainScreen } from "./screens/MainScreen";
import { ThemeProvider } from "styled-components";
import theme from './theme';
import { StatusOnlyScreen } from "./screens/StatusOnlyScreen";

export default function App() {

 return (
   <ThemeProvider theme={theme}>
     <MachineProvider machine={appMachine}>
       <State matches={['auth.checkingSession', 'auth.authenticating']}>
         <StatusOnlyScreen/>
       </State>
       <State matches={'auth.signedOut'}>
         <LoginScreen/>
       </State>
       <State matches={'auth.signedIn'}>
         <MainScreen/>
       </State>
     </MachineProvider>
   </ThemeProvider>
 );
}

