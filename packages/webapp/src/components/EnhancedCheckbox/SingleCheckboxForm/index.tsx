import React, { useContext } from "react";
import { EnhancedCheckbox, EnhancedCheckboxProps } from "../index";
import { SingleCheckboxGroupContext } from "../SingleCheckboxFormAccepter";

export function SingleCheckboxForm({
  onChange,
  onBlur,
  checked,
  readOnly,
  name,
  ...rest
}: EnhancedCheckboxProps) {
  const {
    name: nameContext,
    readOnly: readOnlyContext,
    value: valueContext,
    onChange: onChangeContext,
    onBlur: onBlurContext,
  } = useContext(SingleCheckboxGroupContext);

  return (
    <EnhancedCheckbox
      {...rest}
      name={name || nameContext}
      readOnly={readOnly || readOnlyContext}
      checked={checked === undefined ? valueContext : checked}
      onChange={onChange || onChangeContext}
      onBlur={onBlur || onBlurContext}
    />
  );
}
