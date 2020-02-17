import React from 'react';
import { select } from '@storybook/addon-knobs';
import { Text } from "./index";

export default { title: 'Text' };

export const scale = () => {
  const color = select('color', ['primary', 'secondary'], 'primary');

  return (
    <ul>
      <li>
        <Text.Title color={color}>Title</Text.Title>
      </li>
      <li>
        <Text.Subtitle color={color}>Subtitle</Text.Subtitle>
      </li>
      <li>
        <Text.Body color={color}>Body</Text.Body>
      </li>
      <li>
        <Text.Caption color={color}>Caption</Text.Caption>
      </li>
    </ul>
  )
};