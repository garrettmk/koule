import React from 'react';
import { Select } from "./index";

export default {
  title: 'Select'
};

export const story = () => (
  <Select>
    <option value={1}>One</option>
    <option value={2}>Two</option>
    <option value={3}>Three</option>
  </Select>
);