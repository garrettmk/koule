import React from 'react';
import appMachine from "./machines/app";
import MachineProvider from './containers/MachineProvider';
import SignedIn from "./containers/SignedIn";
import SignedOut from "./containers/SignedOut";
import LoginPage from "./pages/LoginPage";
import State from "./containers/State";
import HomePage from "./pages/HomePage";
import CalendarPage from "./pages/CalendarPage";
import DayPage from "./pages/DayPage";
import TaskPage from "./pages/TaskPage";
import GroupPage from "./pages/GroupPage";


export default function App() {

 return (
   <MachineProvider machine={appMachine}>
     <SignedOut>
       <LoginPage/>
     </SignedOut>
     <SignedIn>
       <State matches={'navigation.home'}>
        <HomePage/>
       </State>
       <State matches={'navigation.calendar'}>
         <CalendarPage/>
       </State>
       <State matches={'navigation.day'}>
         <DayPage/>
       </State>
       <State matches={'navigation.task'}>
         <TaskPage/>
       </State>
       <State matches={'navigation.group'}>
         <GroupPage/>
       </State>
     </SignedIn>
     {/*<SignInFailed>*/}
       {/*Sign in failed.*/}
       {/*<button onClick={() => send('SIGN_IN')}>Retry</button>*/}
     {/*</SignInFailed>*/}
   </MachineProvider>
 );
}

