import React, { useContext } from 'react';
import { ThemeContext } from "styled-components";
import * as S from './styled';


export function ColorSelector({ className, color: value, onChange, ...props }) {
  const theme = useContext(ThemeContext);
  const colors = ['orange', 'blue', 'none'];

  return (
    <S.ColorSelector {...props}>
      {colors.map(color => (
        <S.Swatch
          color={color}
          onClick={() => onChange(color)}
        />
      ))}
    </S.ColorSelector>
  )
}