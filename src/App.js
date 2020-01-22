import React from 'react';
import appMachine from "./machines/app";
import { MachineProvider, SignedIn, SignedOut } from './containers';
import { LoginScreen } from "./screens/LoginScreen";
import { MainScreen } from "./screens/MainScreen";
import { ThemeProvider } from "styled-components";
import theme from './theme';

export default function App() {

 return (
   <ThemeProvider theme={theme}>
     <MachineProvider machine={appMachine}>
       <SignedOut>
         <LoginScreen/>
       </SignedOut>
       <SignedIn>
         <MainScreen/>
       </SignedIn>
     </MachineProvider>
   </ThemeProvider>
 );
}

