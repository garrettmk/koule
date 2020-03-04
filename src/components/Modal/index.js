import React from 'react';
import { createPortal } from "react-dom";
import * as S from './styled';


export function Modal({
  open,
  onClose,
  children,
  ...otherProps
}) {
  if (!open)
    return null;

  const handleClose = () => onClose && onClose();
  const preventBubbling = event => event.stopPropagation();

  return createPortal(
    <S.Overlay onClick={handleClose}>
      <S.Modal onClick={preventBubbling}>
        {children}
      </S.Modal>
    </S.Overlay>,
    document.body
  );
}