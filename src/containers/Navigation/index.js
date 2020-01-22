import React, { useContext } from 'react';
import { MachineProviderContext } from "../../containers";
import { IconButton } from "../../components";
import { GroupIcon, ListIcon, CheckIcon } from "../../icons";
import * as S from './styled';

export function Navigation() {
  const { state, send } = useContext(MachineProviderContext);

  let offset = 0;
  if (state.matches('navigation.groups'))
    offset = -1;
  if (state.matches('navigation.tasks'))
    offset = 0;
  if (state.matches('navigation.currentTask'))
    offset = 1;

  return (
    <S.Navigation>
      <S.Icons offset={offset}>
        <IconButton onClick={() => send('NAVIGATE_GROUPS')}>
          <GroupIcon/>
        </IconButton>

        <IconButton onClick={() => send('NAVIGATE_TASKS')}>
          <ListIcon/>
        </IconButton>

        <IconButton onClick={() => send('NAVIGATE_CURRENT')}>
          <CheckIcon/>
        </IconButton>
      </S.Icons>
    </S.Navigation>
  );
}