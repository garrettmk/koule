import React from 'react';
import styled from 'styled-components';
import { configure, addDecorator, addParameters } from '@storybook/react';
import { withKnobs } from "@storybook/addon-knobs";
import { ThemeProvider } from "styled-components";
import { space, palette, theme } from '../src/theme';

const Background = styled.div`
  background-color: ${palette.background};
  padding: ${space.units(8)};
  box-sizing: border-box;
`;

addParameters({ viewport: { defaultViewport: 'responsive' } });
addDecorator(withKnobs);
addDecorator(storyFn => (
  <ThemeProvider theme={theme}>
    <Background>
      {storyFn()}
    </Background>
  </ThemeProvider>
));
