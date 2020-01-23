import React, { Fragment, useLayoutEffect, useRef } from 'react';
import { List, Collapse, SubList, ColorSelector, Text } from "../../../components";
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
        color={group.color}
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
            <SubList.Item color={group.color} style={{ paddingTop: 24, paddingBottom: 24 }}>
              <ColorSelector
                onChange={color => onUpdate({ color })}
              />
            </SubList.Item>
          </SubList>
        </Collapse.Inner>
      </Collapse.Outer>
    </Fragment>
  )
}