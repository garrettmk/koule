import React from 'react';
import { boolean } from '@storybook/addon-knobs';
import { Modal } from "./index";

export default {
  title: 'Modal',
};

export const story = () => (
  <Modal
    open={boolean('open', true)}
  >
    This is a modal
  </Modal>
);