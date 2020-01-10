import React from 'react';
import MessageButton from '../MessageButton';

export default function Navigation() {
  return (
    <div>
      <MessageButton message={'NAVIGATE_BACK'}>Back</MessageButton>
      <MessageButton message={'NAVIGATE_HOME'}>Home</MessageButton>
      <MessageButton message={'NAVIGATE_CALENDAR'}>Calendar</MessageButton>
      <MessageButton message={{ type: 'NAVIGATE_DAY', date: new Date().toISOString().split('T')[0] }}>Today</MessageButton>
      <MessageButton message={'NAVIGATE_TASK'}>Current Task</MessageButton>
    </div>
  );
}