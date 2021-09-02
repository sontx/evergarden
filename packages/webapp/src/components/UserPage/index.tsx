import React, { ReactNode } from "react";
import { SEO } from "../SEO";
import { AppHeader } from "../AppHeader";
import { AppFooter } from "../AppFooter";
import { AppContainer } from "../AppContainer";

import { StandardProps } from "rsuite/es/@types/common";
import classNames from "classnames";
import { AppContent } from "../AppContent";

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
      <AppContent flexFlow={fullContent}>
        <div className="page-header">
          {header ? header : <h5 className="page-title">{title}</h5>}
          {action && <div className="page-action">{action}</div>}
        </div>
        {children}
      </AppContent>
      <AppFooter />
    </AppContainer>
  );
}
