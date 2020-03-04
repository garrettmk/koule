import React from 'react';
import { useMachineProvider } from "../../hooks";
import { HeaderComponent } from './component';
import { titleForNavEvent } from "./utils";

export function Header() {
  const { state, navigateBack, currentNavEvent, lastNavEvent } = useMachineProvider(({ state, send, context }) => ({
    state,
    currentNavEvent: context.navigationHistory[context.navigationHistory.length - 1] || {},
    lastNavEvent: context.navigationHistory[context.navigationHistory.length - 2] || {},
    navigateBack: () => send('NAVIGATE_BACK'),
  }));

  const currentTitle = titleForNavEvent(currentNavEvent);
  const lastTitle = titleForNavEvent(lastNavEvent);
  const isLoading =
    state.matches('auth.authenticating') ||
    state.matches('auth.checkingSession') ||
    state.matches('tasks.loading') ||
    state.matches('groups.loading') ||
    state.matches('task.loading') ||
    state.matches('task.saving') ||
    state.matches('group.loading') ||
    state.matches('group.saving');

  return (
    <HeaderComponent
      title={currentTitle}
      lastTitle={lastTitle}
      onNavigateBack={navigateBack}
      isLoading={isLoading}
    />
  );
}