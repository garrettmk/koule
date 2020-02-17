import React from 'react';
import { useMachineProvider } from "../../hooks";
import { IconButton } from "../../components/";
import * as S from './styled';

export function BackButton(props) {
  const { navigateBack, disabled } = useMachineProvider(({ send, context }) => ({
    navigateBack: () => send('NAVIGATE_BACK'),
    disabled: context.navigationHistory.length < 2
  }));

  return (
    <IconButton
      onClick={navigateBack}
      disabled={disabled}
      {...props}
    >
      <S.BackIcon/>
    </IconButton>
  );
}