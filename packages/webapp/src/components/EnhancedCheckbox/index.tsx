import { CheckboxProps } from "rsuite/lib/Checkbox/Checkbox";
import { Checkbox } from "rsuite";

import "./index.less";
import classNames from "classnames";
import React from "react";

export type EnhancedCheckboxProps = CheckboxProps & { description?: string };

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
