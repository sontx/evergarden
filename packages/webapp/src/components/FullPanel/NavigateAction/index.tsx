import { StandardProps } from "rsuite/es/@types/common";
import { FormattedMessage } from "react-intl";
import { Icon } from "rsuite";

export function NavigateAction({ children, ...rest }: StandardProps) {
  return (
    <a {...rest}>
      {children || <FormattedMessage id="showMore" />} <Icon icon="right" />
    </a>
  );
}
