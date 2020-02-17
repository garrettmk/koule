import React from 'react';
import { Button } from "../../components";
import * as S from './styled';
import { useMachineProvider } from "../../hooks";


export function LoginScreen() {
  const send = useMachineProvider(({ send }) => send);

  return (
    <S.LoginScreen>
      <S.Title>Koule</S.Title>
      <Button
        variant={'solid'}
        color={'blue'}
        onClick={() => send({ type: 'SIGN_IN', loginRequired: false })}
      >
        Sign In
      </Button>
    </S.LoginScreen>
  );
}