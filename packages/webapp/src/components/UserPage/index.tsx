import React, { ReactNode } from "react";
import { SEO } from "../SEO";
import { AppHeader } from "../AppHeader";
import { Content } from "rsuite";
import { AppFooter } from "../AppFooter";
import { AppContainer } from "../AppContainer";

import "./index.less";
import { StandardProps } from "rsuite/es/@types/common";
import classNames from "classnames";

export function UserPage({
  children,
  title,
  action,
  header,
  className,
  style,
  fullContent = true,
}: {
  children: ReactNode;
  title: string;
  header?: ReactNode;
  action?: ReactNode;
  fullContent?: boolean;
} & StandardProps) {
  return (
    <AppContainer
      className={classNames("user-page-container", className)}
      style={{
        ...(fullContent ? { minHeight: "100vh" } : {}),
        ...(style || {}),
      }}
    >
      <SEO title={title} />
      <AppHeader />
      <Content
        style={{
          padding: "10px",
          ...(fullContent ? { display: "flex", flexDirection: "column" } : {}),
        }}
      >
        <div className="page-header">
          {header ? header : <h5 className="page-title">{title}</h5>}
          {action && <div className="page-action">{action}</div>}
        </div>
        {children}
      </Content>
      <AppFooter />
    </AppContainer>
  );
}
