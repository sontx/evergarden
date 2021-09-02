import { Radio, RadioProps } from "rsuite";
import classNames from "classnames";
import { ReactNode } from "react";

export function EnhancedRadio({
  description,
  children,
  className,
  ...rest
}: RadioProps & { description?: ReactNode }) {
  return (
    <Radio {...rest} className={classNames("enhanced-radio", className)}>
      {children}
      {description && <span className="radio-description">{description}</span>}
    </Radio>
  );
}
