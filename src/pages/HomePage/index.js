import React from 'react';
import MessageButton from "../../components/MessageButton";

export default function HomePage() {
  return (
    <div>
      <MessageButton message={'NAVIGATE_CALENDAR'}>Calendar</MessageButton>
      <MessageButton message={'NAVIGATE_DAY'}>Today</MessageButton>
      <MessageButton message={'NAVIGATE_TASK'}>Current Task</MessageButton>
      <MessageButton message={'SIGN_OUT'}>Sign out</MessageButton>
    </div>
  )
}