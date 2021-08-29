import { StandardProps } from "rsuite/es/@types/common";
import { ReactNode } from "react";
import { Content } from "rsuite";
import classNames from "classnames";

import "./index.less";

export function AppContent({
  className,
  children,
  noPadding,
  flexFlow,
  ...rest
}: StandardProps & {
  children: ReactNode;
  noPadding?: boolean;
  flexFlow?: boolean;
}) {
  return (
    <Content
      className={classNames(
        className,
        "app-content",
        {
          "app-content--padding": !noPadding,
        },
        { "app-content--flex": flexFlow },
      )}
      {...rest}
    >
      {children}
    </Content>
  );
}
