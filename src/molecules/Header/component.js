import React from 'react';
import { Button } from "../../atoms";
import * as S from './styled';

export function HeaderComponent({
  title = 'Koule',
  lastTitle,
  onNavigateBack,
  onMenuClicked,
  isLoading,
  notification,
}) {
  if (notification)
    return (
      <S.Frame>
        <S.Notification>
          {notification.type}
        </S.Notification>
      </S.Frame>
    );

  return (
    <S.Frame>
      {lastTitle && onNavigateBack && (
        <Button outlined={false} filled={false} onClick={onNavigateBack}>
          {lastTitle}
        </Button>
      )}

      <S.Spacer/>

      <S.Title>
        {title}
      </S.Title>

      {onMenuClicked && (
        <Button outlined={false} filled={false}>
          Menu
        </Button>
      )}

      <S.Loader active={isLoading}/>
    </S.Frame>
  );
}