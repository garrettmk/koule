import React from 'react';
import { Hero, Button, Body } from "../../atoms";
import { useMachineProvider } from "../../hooks";
import * as S from './styled';
import { State } from "../../containers/State";

export function LoginPage(props) {
  const login = useMachineProvider(({ send }) => () => send('SIGN_IN'));

  return (
    <S.LoginPage {...props}>
      <State matches={'auth.signedOut'}>
        <Button filled onClick={login}>Login</Button>
      </State>
      <State matches={['auth.checkingSession', 'auth.authenticating']}>
        <Body>Authenticating</Body>
      </State>
    </S.LoginPage>
  );
}