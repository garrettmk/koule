import React from 'react';
import { Text, Button } from "../../components";
import * as S from './styled';
import { useMachineProvider } from "../../hooks";


export function LoginScreen() {
  const send = useMachineProvider(({ send }) => send);

  return (
    <S.LoginScreen>
      <Text.Title>Koule</Text.Title>
      <Button onClick={() => send({ type: 'SIGN_IN', loginRequired: false })}>
        Sign In
      </Button>
    </S.LoginScreen>
  );
}