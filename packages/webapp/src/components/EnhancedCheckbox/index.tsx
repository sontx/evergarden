import { CheckboxProps } from "rsuite/lib/Checkbox/Checkbox";
import { Checkbox } from "rsuite";

import classNames from "classnames";
import React, { ReactNode } from "react";

export type EnhancedCheckboxProps = CheckboxProps & { description?: ReactNode };

export function EnhancedCheckbox({
  children,
  description,
  className,
  ...rest
}: EnhancedCheckboxProps) {
  return (
    <Checkbox {...rest} className={classNames(className, "enhanced-checkbox")}>
      {children}
      <span className="checkbox-description">{description}</span>
    </Checkbox>
  );
}
