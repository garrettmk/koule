import React from 'react';
import { useMachineProvider } from "../../hooks";
import { IconButton } from "../../components/";
import * as S from './styled';

export function BackButton(props) {
  const { navigateBack, disabled, lastNavigationMessage } = useMachineProvider(({ send, context }) => ({
    navigateBack: () => send('NAVIGATE_BACK'),
    disabled: context.navigationHistory.length < 2,
    lastNavigationMessage: context.navigationHistory[context.navigationHistory.length - 2] || {},
  }));

  const caption = {
    NAVIGATE_GROUPS: 'Groups',
    NAVIGATE_GROUP: 'Group',
    NAVIGATE_TASKS: 'Tasks',
    NAVIGATE_TASK: 'Task',
  }[lastNavigationMessage.type];

  return (
    <IconButton
      onClick={navigateBack}
      disabled={disabled}
      {...props}
    >
      <S.Row>
        <S.BackIcon size={'small'}/>
        <S.Caption>
          {caption}
        </S.Caption>
      </S.Row>
    </IconButton>
  );
}