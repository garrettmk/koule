import React from 'react';
import * as icons from '../../icons';
import * as S from './styled'
import { Flex } from "../../containers/Flex";
import { useMachineProvider } from "../../hooks";


export function ChooseIconPage(props) {
  const { send, task, groupList } = useMachineProvider();
  const { group_id } = task.context;
  const group = groupList.context.groupList.find(group => group.id === group_id) || {};

  const setIcon = icon => () => send({
    type: 'UPDATE_GROUP',
    variables: {
      id: group.id,
      color: group.color,
      description: group.description,
      icon
    }
  });

  return (
    <S.ChooseIconPage {...props}>
      <Flex>
        {Object.entries(icons).map(([name, component]) => (
          <S.IconButton outlined={name === group.icon}>
            {React.createElement(component, {
              onClick: setIcon(name)
            })}
          </S.IconButton>
        ))}
      </Flex>
    </S.ChooseIconPage>
  );
}