import React from 'react';
import appMachine from "./machines/app";
import { MachineProvider, State } from './containers';
import { LoginScreen } from "./screens/LoginScreen";
import { MainScreen } from "./screens/MainScreen";
import { ThemeProvider } from "styled-components";
import theme from './theme';

export default function App() {

 return (
   <ThemeProvider theme={theme}>
     <MachineProvider machine={appMachine}>
       <State not matches={'auth.signedIn'}>
         <LoginScreen/>
       </State>
       <State matches={'auth.signedIn'}>
         <MainScreen/>
       </State>
     </MachineProvider>
   </ThemeProvider>
 );
}

