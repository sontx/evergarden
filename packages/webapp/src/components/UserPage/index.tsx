import React, { ReactNode } from "react";
import { SEO } from "../SEO";
import { AppHeader } from "../AppHeader";
import { Content } from "rsuite";
import { AppFooter } from "../AppFooter";
import { AppContainer } from "../AppContainer";

import "./index.less";

export function UserPage({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <AppContainer className="user-page-container">
      <SEO title={title} />
      <AppHeader />
      <Content style={{ padding: "10px" }}>
        <h5 className="page-title">{title}</h5>
        {children}
      </Content>
      <AppFooter />
    </AppContainer>
  );
}
