import { StandardProps } from "rsuite/es/@types/common";
import { ReactNode } from "react";
import classNames from "classnames";

import "./index.less";

export function GridMenuItem({
  children,
  icon,
  className,
  ...rest
}: { children: ReactNode; icon: ReactNode } & StandardProps) {
  return (
    <div className={classNames(className, "grid-menu-item")} {...rest}>
      <div className="menu-item-icon">{icon}</div>
      <div className="menu-item-text">{children}</div>
    </div>
  );
}
