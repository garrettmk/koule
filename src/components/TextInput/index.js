import React, { useEffect, useState } from 'react';
import * as S from './styled';

export const TextInput = React.forwardRef(({ value = '', onSubmit, ...props }, ref) => {
  const [currentValue, setCurrentValue] = useState(value);
  useEffect(
    () => setCurrentValue(value),
    [value]
  );

  const handleChange = event => setCurrentValue(event.target.value);

  const handleKeyDown = event => {
    if (event.key === 'Enter')
      onSubmit && onSubmit(currentValue);
  };

  const handleBlur = () => {
    onSubmit && onSubmit(currentValue);
  };

  return (
    <S.Input
      ref={ref}
      type={'text'}
      value={currentValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      {...props}
    />
  );
});
