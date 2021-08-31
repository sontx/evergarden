import { ReactNode } from "react";
import { StandardProps } from "rsuite/es/@types/common";
import classNames from "classnames";

import "./index.less";
import { Animation, Divider, Icon } from "rsuite";
import { useNoBodyScrolling } from "../../hooks/useNoBodyScrolling";

export interface FullPanelProps extends StandardProps {
  title: ReactNode;
  children: ReactNode;
  onClose?: () => void;
}

export function FullPanel({
  className,
  title,
  onClose,
  children,
  ...rest
}: FullPanelProps) {
  useNoBodyScrolling();

  return (
    <Animation.Slide in>
      {({ className: className1, ...rest1 }, ref1) => (
        <div
          className={classNames(className, className1, "full-panel")}
          {...rest}
          {...rest1}
          ref={ref1 as any}
        >
          <div className="panel-header">
            <a onClick={onClose} className="header-btn-back no-link">
              <Icon icon="left" />
            </a>
            <span className="panel-title">{title}</span>
          </div>
          <Divider />
          <div className="panel-body">{children}</div>
        </div>
      )}
    </Animation.Slide>
  );
}
