import { ReactNode } from "react";
import { StandardProps } from "rsuite/es/@types/common";
import classNames from "classnames";

import "./index.less";
import { Backdrop } from "../Backdrop";
import { useNoBodyScrolling } from "../../hooks/useNoBodyScrolling";
import { Animation } from "rsuite";
import { useAppSelector } from "../../app/hooks";
import { useOverlay } from "../../hooks/useOverlay";
import { selectIsFloatingHeader } from "../../features/global/globalSlice";

export function GridMenu({
  className,
  children,
  cols,
  onClose,
  ...rest
}: StandardProps & {
  children: ReactNode;
  cols: number;
  onClose?: () => void;
}) {
  const isFloatingHeader = useAppSelector(selectIsFloatingHeader);
  useNoBodyScrolling();
  useOverlay();

  return (
    <div
      className={classNames(className, "grid-menu", {
        "grid-menu--float": isFloatingHeader,
      })}
      {...rest}
      onClick={onClose}
    >
      <Backdrop />
      <Animation.Slide unmountOnExit in>
        {({ className: className1, style, ...rest1 }, ref) => (
          <div
            className={classNames("grid-menu-items", className1)}
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr) )`,
              ...(style || {}),
            }}
            {...rest1}
            ref={ref}
          >
            {children}
          </div>
        )}
      </Animation.Slide>
    </div>
  );
}
