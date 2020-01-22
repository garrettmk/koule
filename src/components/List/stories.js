import React from "react";
import { boolean, select } from "@storybook/addon-knobs";
import { List } from "./index";
import { Text } from "../Text";

export default {
  title: 'List',
};

export const story = () => (
  <List>
    <List.Item selected={boolean('selected', false)}>
      <Text.Subtitle>Hey this is a list item</Text.Subtitle>
    </List.Item>
  </List>
);
