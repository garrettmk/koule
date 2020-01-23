import React, { Fragment, useLayoutEffect, useRef } from 'react';
import { List, Collapse, SubList, ColorSelector } from "../../../components";
import { TrashIcon } from "../../../icons";
import * as S from './styled';


export function GroupItem({ group, selected, onSelect, onUpdate }) {
  const textInputRef = useRef();
  useLayoutEffect(
    () => { selected && textInputRef.current.focus() },
    [selected]
  );

  return (
    <Fragment>
      <List.Item
        selected={selected}
        onClick={() => onSelect(group)}
        color={group.color || 'gray'}
        style={{ marginTop: 1 }}
      >
        <S.DescriptionInput
          ref={textInputRef}
          disabled={!selected}
          value={group.description}
          onSubmit={description => onUpdate({ description })}
          readOnly={!selected}
        />
        <S.TrashButton disabled={!selected}>
          <TrashIcon/>
        </S.TrashButton>
      </List.Item>
      <Collapse.Outer open={selected}>
        <Collapse.Inner>
          <SubList>
            <S.SubListItem color={group.color}>
              <ColorSelector
                onChange={color => onUpdate({ color })}
              />
            </S.SubListItem>
          </SubList>
        </Collapse.Inner>
      </Collapse.Outer>
    </Fragment>
  )
}