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
  showBackTop,
}: {
  children: ReactNode;
  title: string;
  header?: ReactNode;
  action?: ReactNode;
  fullContent?: boolean;
  showBackTop?: boolean;
} & StandardProps) {
  return (
    <AppContainer
      className={classNames("user-page-container", className)}
      style={{
        ...(fullContent ? { minHeight: "100vh" } : {}),
        ...(style || {}),
      }}
      showBackTop={showBackTop}
    >
      <SEO title={title} />
      <AppHeader />
      <AppContent flexFlow={fullContent}>
        <div className="page-header">
          {header ? header : <span className="page-title">{title}</span>}
          {action && <div className="page-action">{action}</div>}
        </div>
        {children}
      </AppContent>
      <AppFooter />
    </AppContainer>
  );
}
