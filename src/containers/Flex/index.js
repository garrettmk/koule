import React from 'react';
import styled from 'styled-components';
import { space } from "../../theme";

const Inner = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: ${ ({ gap, theme }) => space.units(-gap / 2)({ theme }) };
  & > * {
    margin: ${ ({ gap, theme }) => space.units(gap / 2)({ theme }) };
  }
`;


export function Flex({ gap, children, ...props }) {
  return (
    <div {...props}>
      <Inner gap={gap}>
        {children}
      </Inner>
    </div>
  );
}