import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { space, palette, fonts } from "../../theme";

const Input = styled.input`
  min-height: ${space.units(6)};
  padding: ${space.units(1)};
  box-sizing: border-box;
  background-color: ${palette.foreground};
  color: ${palette.textPrimary};
  border: 2px solid transparent;
  border-radius: ${space.borderRadius};
  font: ${fonts.body};
  
  &:hover:not([readonly]), &:focus:not([readonly]) {
    border-color: ${palette.divider};
  }
  
  &[disabled] {
    pointer-events: none;
  }
  
  transition: border-color 100ms linear;
`;

export const TextInput = React.forwardRef(({ value = '', onSubmit, ...props }, ref) => {
  const [currentValue, setCurrentValue] = useState(value);
  useEffect(() => setCurrentValue(value), [value]);

  const handleChange = event => setCurrentValue(event.target.value);
  const handleKeyDown = event => onSubmit && event.key === 'Enter' && onSubmit(currentValue);
  const handleBlur = () => onSubmit && onSubmit(currentValue);

  return (
    <Input
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