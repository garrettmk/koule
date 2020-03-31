import React from 'react';
import { useMachineProvider } from "../../hooks";
import { HeaderComponent } from './component';
import { titleForNavEvent } from "./utils";

export function Header() {
  const { send, ui, auth, nav } = useMachineProvider();

  const currentNavEvent = nav.context.history[nav.context.history.length - 1] || {};
  const lastNavEvent = nav.context.history[nav.context.history.length - 2] || {};

  const currentTitle = titleForNavEvent(currentNavEvent);
  const lastTitle = titleForNavEvent(lastNavEvent);
  const navigateBack = () => send('NAVIGATE_BACK');
  const isLoading = auth.matches('authenticating') || ui.matches('loading');

  return (
    <HeaderComponent
      title={currentTitle}
      lastTitle={lastTitle}
      onNavigateBack={navigateBack}
      isLoading={isLoading}
    />
  );
}