import React from 'react';
import * as S from './styled';


export function LinearLoader({ color = 'primary', active, ...otherProps }) {
  return (
    <S.Root active={active} {...otherProps}>
      <S.Backdrop color={color}/>
      <S.Inner color={color}/>
    </S.Root>
  );
}