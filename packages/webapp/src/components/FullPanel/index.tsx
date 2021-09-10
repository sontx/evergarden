import { ReactNode } from "react";
import { StandardProps } from "rsuite/es/@types/common";
import classNames from "classnames";

import { Animation, Divider, Icon } from "rsuite";
import { useNoBodyScrolling } from "../../hooks/useNoBodyScrolling";
import { useOverlay } from "../../hooks/useOverlay";

export interface FullPanelProps extends StandardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  onClose?: () => void;
}

export function FullPanel({
  className,
  title,
  subtitle,
  onClose,
  children,
  ...rest
}: FullPanelProps) {
  useNoBodyScrolling();
  useOverlay();

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
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a onClick={onClose} className="header-btn-back">
              <Icon icon="left" />
            </a>
            <span className="header-right">
              <span className="panel-title">{title}</span>
              {subtitle && <span className="panel-subtitle">{subtitle}</span>}
            </span>
          </div>
          <Divider />
          <div className="panel-body">{children}</div>
        </div>
      )}
    </Animation.Slide>
  );
}
