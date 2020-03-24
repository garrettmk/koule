import React from 'react';
import { Body, Button } from "../../atoms";
import { useMachineProvider } from "../../hooks";
import * as S from './styled';
import { State } from "../../containers/State";

export function LoginPage(props) {
  const login = useMachineProvider(({ send }) => () => send('SIGN_IN'));

  return (
    <S.LoginPage {...props}>
      <State matches={'[auth]signedOut'}>
        <Button filled onClick={login}>Sign In</Button>
      </State>
      <State matches={'[auth]authenticating'}>
        <Body>Authenticating</Body>
      </State>
      <State matches={['[ui]loading']}>
        <Body>Loading...</Body>
      </State>
    </S.LoginPage>
  );
}