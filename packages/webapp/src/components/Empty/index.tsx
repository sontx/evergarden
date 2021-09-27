import { StandardProps } from "rsuite/es/@types/common";
import { ReactNode } from "react";
import classNames from "classnames";
import { FormattedMessage } from "react-intl";
import { Icon } from "rsuite";

export function Empty({
  children,
  className,
  ...rest
}: StandardProps & { children?: ReactNode }) {
  return (
    <div className={classNames("empty", className)} {...rest}>
      {children || <div>
        <Icon icon="inbox"/>
        <FormattedMessage id="emptyLabel" />
      </div>}
    </div>
  );
}
