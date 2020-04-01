import React from 'react';
import { useMachineProvider } from "../../hooks";
import { HeaderComponent } from './component';
import { titleForUiState } from "./utils";

export function Header() {
  const { send, ui, auth } = useMachineProvider();

  const isLoading = auth.matches('authenticating') || ui.matches('loading');
  const currentTitle = ui.context.title;
  const lastTitle = ui.context.back;
  const navigateBack = () => send('NAVIGATE_BACK');

  return (
    <HeaderComponent
      title={currentTitle}
      lastTitle={lastTitle}
      onNavigateBack={navigateBack}
      isLoading={isLoading}
    />
  );
}