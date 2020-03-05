import React from 'react';
import * as icons from '../../icons';
import * as S from './styled'
import { Flex } from "../../containers/Flex";
import { useMachineProvider } from "../../hooks";


export function ChooseIconPage(props) {
  const { send, group } = useMachineProvider(({ send, context }) => ({
    send,
    group: context.task.data.group
  }));

  const navigateBack = () => send('NAVIGATE_BACK');
  const updateIcon = icon => () => send({ type: 'SAVE_GROUP', data: { ...group, icon } });

  return (
    <S.ChooseIconPage {...props}>
      <Flex>
        {Object.entries(icons).map(([name, component]) => (
          <S.IconButton outlined={name === group.icon}>
            {React.createElement(component, {
              onClick: updateIcon(name)
            })}
          </S.IconButton>
        ))}
      </Flex>
    </S.ChooseIconPage>
  );
}