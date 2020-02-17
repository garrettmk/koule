import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from "react-dom";
import * as S from './styled';


export function Modal({
  open,
  children,
  ...otherProps
}) {
  if (!open)
    return null;

  return createPortal(
    <S.Overlay>
      <S.Modal>
        {children}
      </S.Modal>
    </S.Overlay>,
    document.body
  );
}