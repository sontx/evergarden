import { StandardProps } from "rsuite/es/@types/common";
import { ReactNode, SyntheticEvent } from "react";
import classNames from "classnames";

export function GridMenuItem({
  children,
  icon,
  className,
  preventClick,
  onClick,
  ...rest
}: {
  children: ReactNode;
  icon?: ReactNode;
  preventClick?: boolean;
} & StandardProps) {
  const handleClick = preventClick
    ? (event: SyntheticEvent) => {
        event.preventDefault();
        event.stopPropagation();
      }
    : onClick;
  return (
    <div
      className={classNames(className, "grid-menu-item")}
      {...rest}
      onClick={handleClick}
    >
      {icon && <div className="menu-item-icon">{icon}</div>}
      <div className="menu-item-text">{children}</div>
    </div>
  );
}
