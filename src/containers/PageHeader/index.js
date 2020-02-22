import React from 'react';
import { Header } from "../../components";
import { BackButton } from "../BackButton";

export function PageHeader({
  title = 'Page Title',
  loading = false,
  ...otherProps
}) {
  return (
    <Header {...otherProps}>
      <Header.Navigation>
        <BackButton/>
      </Header.Navigation>

      <Header.Title>
        {title}
      </Header.Title>

      <Header.Loader active={loading}/>
    </Header>
  );
}