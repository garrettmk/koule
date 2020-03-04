import React from 'react';
import { ListItemPrimary, ListItemSecondary, Body, Body2 } from "../index";
import { TrashIcon } from "../../icons/Trash";
import { List } from './index';

export default {
  title: 'Atoms / List'
};

export const PrimaryItems = () => (
  <List>
    <ListItemPrimary>
      <TrashIcon/>
      <Body>First Item</Body>
      <Body monospaced>1234</Body>
    </ListItemPrimary>
    <ListItemPrimary>
      <TrashIcon/>
      <Body>Second Item</Body>
      <Body monospaced>5678</Body>
    </ListItemPrimary>
    <ListItemPrimary>
      <TrashIcon/>
      <Body>Third Item</Body>
      <Body monospaced>5678</Body>
    </ListItemPrimary>
  </List>
);

export const SecondaryItems = () => (
  <List>
    <ListItemSecondary>
      <Body2>First Item</Body2>
      <Body2 monospaced>1234</Body2>
    </ListItemSecondary>
    <ListItemSecondary>
      <Body2>Second Item</Body2>
      <Body2 monospaced>1234</Body2>
    </ListItemSecondary>
    <ListItemSecondary>
      <Body2>Third Item</Body2>
      <Body2 monospaced>1234</Body2>
    </ListItemSecondary>
  </List>
);

export const MixedItems = () => (
  <List>
    <ListItemPrimary>
      <TrashIcon/>
      <Body>First Group</Body>
      <Body monospaced>1234</Body>
    </ListItemPrimary>
    <ListItemSecondary>
      <Body2>First Item</Body2>
      <Body2 monospaced>1234</Body2>
    </ListItemSecondary>
    <ListItemSecondary>
      <Body2>Second Item</Body2>
      <Body2 monospaced>1234</Body2>
    </ListItemSecondary>
    <ListItemSecondary>
      <Body2>Third Item</Body2>
      <Body2 monospaced>1234</Body2>
    </ListItemSecondary>

    <ListItemPrimary>
      <TrashIcon/>
      <Body>Second Group</Body>
      <Body monospaced>1234</Body>
    </ListItemPrimary>
    <ListItemSecondary>
      <Body2>First Item</Body2>
      <Body2 monospaced>1234</Body2>
    </ListItemSecondary>
    <ListItemSecondary>
      <Body2>Second Item</Body2>
      <Body2 monospaced>1234</Body2>
    </ListItemSecondary>
    <ListItemSecondary>
      <Body2>Third Item</Body2>
      <Body2 monospaced>1234</Body2>
    </ListItemSecondary>
  </List>
)