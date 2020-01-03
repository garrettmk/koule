import React, { createContext, useMemo } from 'react';
import { useMachine } from "@xstate/react";
import { AppMachine, eventCreators } from "./machines/app";
import { MachineContext } from "./containers/MachineContext";
import { bindEventCreators } from "./utils";
import SignedIn from "./containers/SignedIn";
import SignedOut from "./containers/SignedOut";
import SignInFailed from "./containers/SignInFailed";
import LoginPage from "./pages/LoginPage";
import State from "./containers/State";
import HomePage from "./pages/HomePage";
import CalendarPage from "./pages/CalendarPage";
import DayPage from "./pages/DayPage";
import TaskPage from "./pages/TaskPage";


export default function App() {
 const [current, send] = useMachine(AppMachine);
 const value = useMemo(
   () => ({
     state: current,
     context: current.context,
     send,
     ...bindEventCreators(eventCreators, send)
   }),
   [current, send]
 );

 return (
   <MachineContext.Provider value={value}>
     <SignedOut>
       <LoginPage/>
     </SignedOut>
     <SignedIn>
       <State matches={'home'}>
        <HomePage/>
       </State>
       <State matches={'calendar'}>
         <CalendarPage/>
       </State>
       <State matches={'day'}>
         <DayPage/>
       </State>
       <State matches={'task'}>
         <TaskPage/>
       </State>
     </SignedIn>
     <SignInFailed>
       Sign in failed.
       <button onClick={() => send('SIGN_IN')}>Retry</button>
     </SignInFailed>
   </MachineContext.Provider>
 );
}

