import React from 'react';
import { State } from "../../containers";
import { Text } from "../../components";
import * as S from './styled';


export function StatusOnlyScreen() {
  return (
    <S.Screen>
      <State matches={'auth.checkingSession'}>
        <Text.Subtitle>
          Checking session...
        </Text.Subtitle>
      </State>
      <State matches={'auth.authenticating'}>
        Authenticating...
      </State>
    </S.Screen>
  );
}