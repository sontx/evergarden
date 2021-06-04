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
  action,
}: {
  children: ReactNode;
  title: string;
  action?: ReactNode;
}) {
  return (
    <AppContainer className="user-page-container">
      <SEO title={title} />
      <AppHeader />
      <Content style={{ padding: "10px" }}>
        <div className="page-header">
          <h5 className="page-title">{title}</h5>
          {action && <div className="page-action">{action}</div>}
        </div>
        {children}
      </Content>
      <AppFooter />
    </AppContainer>
  );
}
