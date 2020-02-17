import React from "react";
import { List } from "./index";

export default {
  title: 'List',
};

export const Plain = () => (
  <List>
    <List.Item>
      One
    </List.Item>
    <List.Item>
      Two
    </List.Item>
    <List.Section>
      Section
    </List.Section>
    <List.Item>
      Three
    </List.Item>
  </List>
);


export const Divided = () => (
  <List>
    <List.Item>
      One
      <List.Divider/>
    </List.Item>
    <List.Item>
      Two
      <List.Divider/>
    </List.Item>
    <List.Section>
      Section
    </List.Section>
    <List.Item>
      Three
      <List.Divider/>
    </List.Item>
  </List>
);

export const Colored = () => (
  <List>
    <List.Item>
      One
      <List.Color color={'blue'}/>
    </List.Item>
    <List.Item>
      Two
      <List.Color color={'orange'}/>
    </List.Item>
    <List.Section>
      Section
    </List.Section>
    <List.Item>
      Three
      <List.Color color={'white'}/>
    </List.Item>
  </List>
);

export const DividedAndColored = () => (
  <List>
    <List.Item>
      One
      <List.Color color={'blue'}/>
      <List.Divider/>
    </List.Item>
    <List.Item>
      Two
      <List.Color color={'orange'}/>
      <List.Divider/>
    </List.Item>
    <List.Section>
      Section
    </List.Section>
    <List.Item>
      Three
      <List.Color color={'white'}/>
      <List.Divider/>
    </List.Item>
  </List>
);