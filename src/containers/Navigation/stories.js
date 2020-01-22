import React from "react";
import { boolean, select } from "@storybook/addon-knobs";
import { Machine } from "xstate";
import { Navigation } from './index';
import { MachineProvider, Pager, Page } from "../../containers";
import { Screen, Header, List, Text } from "../../components";

const navigationMachine = Machine({
  id: 'nav-test-machine',
  initial: 'navigation.groups',
  type: 'parallel',
  states: {
    navigation: {
      initial: 'groups',
      states: {
        groups: {},
        tasks: {},
        current: {}
      }
    }
  },
  on: {
    NAVIGATE_GROUPS: 'navigation.groups',
    NAVIGATE_TASKS: 'navigation.tasks',
    NAVIGATE_CURRENT: 'navigation.current'
  }
});


export default {
  title: 'Navigation',
};

export const story = () => (
  <MachineProvider machine={navigationMachine}>
    <Navigation/>
  </MachineProvider>
);


export const withScreens = () => (
  <MachineProvider machine={navigationMachine}>
    <Screen style={{ overflow: 'hidden' }}>
      <Pager style={{ flex: '1 1 100%', color: 'white' }}>
        <Page matches={'navigation.groups'}>
          <Text.Subtitle>Groups</Text.Subtitle>
          <List>
            <List.Item>
              <Text.Subtitle>List Item</Text.Subtitle>
            </List.Item>
          </List>
        </Page>
        <Page matches={'navigation.tasks'}>
          <Text.Subtitle>Tasks</Text.Subtitle>
        </Page>
        <Page matches={'navigation.current'}>
          <Text.Subtitle>Current Task</Text.Subtitle>
        </Page>
      </Pager>
      <Navigation/>
    </Screen>
  </MachineProvider>
);