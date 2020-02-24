import React from 'react';
import { State } from '../../containers';
import { Button, Text } from "../../components";
import * as S from './styled';
import { useMachineProvider } from "../../hooks";


export function LoginScreen() {
  const send = useMachineProvider(({ send }) => send);

  return (
    <S.LoginScreen>
      <State matches={'auth.signedOut'}>
        <S.Title>Koule</S.Title>
        <Button
          variant={'solid'}
          color={'blue'}
          onClick={() => send({ type: 'SIGN_IN', loginRequired: false })}
        >
          Sign In
        </Button>
      </State>
      <State matches={'auth.checkingSession'}>
        <Text.Body>Checking session...</Text.Body>
      </State>
      <State matches={'auth.authenticating'}>
        <Text.Body>Authenticating...</Text.Body>
      </State>
    </S.LoginScreen>
  );
}