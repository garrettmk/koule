import React, { Fragment, useState } from 'react';
import { Body } from "../../../../atoms";
import { Collapse } from "../../../../containers/Collapse";
import * as icons from '../../../../icons';
import * as S from './styled';
import { formatTotalTaskTime } from "../../utils";


export function GroupItem({ children, group = {}, tasks = [], ...props }) {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);

  const { icon, description } = group;
  const iconElement = icon && React.createElement(icons[icon]);

  return (
    <Fragment>
      <S.PrimaryItem open={open} onClick={toggleOpen} {...props}>
        {iconElement || <S.DummyIcon/>}
        {description ? (
          <Body>{description}</Body>
        ) : (
          <Body color={'textSecondary'}>{tasks.length} miscellaneous</Body>
        )}
        <Body monospaced color={'primary'}>
          {formatTotalTaskTime(tasks)}
        </Body>
      </S.PrimaryItem>
      <li>
        <S.CollapseOuter open={open}>
          <S.CollapseInner>
            {children}
          </S.CollapseInner>
        </S.CollapseOuter>
      </li>
    </Fragment>
  );
}