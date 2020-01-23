import React from 'react';
import { configure, addDecorator, addParameters } from '@storybook/react';
import { withKnobs } from "@storybook/addon-knobs";
import { ThemeProvider } from "styled-components";
import theme from '../src/theme.js';
import { Screen } from '../src/components';

// addParameters({ viewport: { defaultViewport: 'responsive' } });
//
// function loadStories() {
//   const ctx = require.context('../src', true, /stories\.js$/);
//   ctx.keys().forEach(filename => ctx(filename));
// }
//
// configure(loadStories, module);

addDecorator(withKnobs);
addDecorator(storyFn => (
  <ThemeProvider theme={theme}>
    <Screen style={{ padding: 72 }}>
      {storyFn()}
    </Screen>
  </ThemeProvider>
));
