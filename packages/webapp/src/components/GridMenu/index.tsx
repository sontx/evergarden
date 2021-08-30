import { ReactNode } from "react";
import { StandardProps } from "rsuite/es/@types/common";
import classNames from "classnames";

import "./index.less";
import { Backdrop } from "../Backdrop";
import { useNoBodyScrolling } from "../../hooks/useNoBodyScrolling";
import { Animation } from "rsuite";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectIsFloatingHeader,
  setShowMenu,
} from "../../features/settings/settingsSlice";

export function GridMenu({
  className,
  children,
  cols,
  ...rest
}: StandardProps & {
  children: ReactNode;
  cols: number;
}) {
  const isFloatingHeader = useAppSelector(selectIsFloatingHeader);
  const dispatch = useAppDispatch();
  useNoBodyScrolling();

  return (
    <div
      className={classNames(className, "grid-menu", {
        "grid-menu--float": isFloatingHeader,
      })}
      {...rest}
      onClick={() => dispatch(setShowMenu(false))}
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
