import React, { useEffect, useState } from 'react';

export default function TextInput({ value, onSubmit, ...props }) {
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

  return (
    <input
      type={'text'}
      value={currentValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}