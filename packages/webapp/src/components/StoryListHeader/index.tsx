import { StandardProps } from "rsuite/es/@types/common";

import { ReactNode } from "react";
import classNames from "classnames";
import { Icon } from "rsuite";
import { FormattedMessage } from "react-intl";

export function StoryListHeader({
  className,
  title,
  action,
  subtitle,
  ...rest
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
} & StandardProps) {
  return (
    <div className={classNames(className, "story-list-header")}>
      <div>
        <span className="title">{title}</span>
        {subtitle && <span className="subtitle">{subtitle}</span>}
      </div>
      {action && <div className="action">{action}</div>}
    </div>
  );
}

export function NavigateAction({children, ...rest}: StandardProps) {
  return <a {...rest}>
    {children || <FormattedMessage id="showMore"/>} <Icon icon="right"/>
  </a>
}
