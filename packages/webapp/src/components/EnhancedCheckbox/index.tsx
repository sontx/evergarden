import { CheckboxProps } from "rsuite/lib/Checkbox/Checkbox";
import { Checkbox } from "rsuite";

import "./index.less";
import classNames from "classnames";
import { FormControlAccepterProps } from "rsuite/lib/FormControl/FormControl";
import React, { createContext, ReactNode, useContext } from "react";

const CheckboxGroupContext = createContext<{
  name?: string;
  value?: boolean;
  readOnly?: boolean;
  onBlur?: (event: React.SyntheticEvent<HTMLInputElement>) => void;
  onChange?: (
    value: any,
    checked: boolean,
    event: React.SyntheticEvent<HTMLInputElement>,
  ) => void;
}>({});

export function EnhancedCheckbox({
  children,
  description,
  className,
  onChange,
  onBlur,
  checked,
  readOnly,
  name,
  ...rest
}: CheckboxProps & { description?: string }) {
  const {
    name: nameContext,
    readOnly: readOnlyContext,
    value: valueContext,
    onChange: onChangeContext,
    onBlur: onBlurContext,
  } = useContext(CheckboxGroupContext);

  return (
    <Checkbox
      {...rest}
      name={name || nameContext}
      readOnly={readOnly || readOnlyContext}
      checked={checked === undefined ? valueContext : checked}
      onChange={onChange || onChangeContext}
      onBlur={onBlur || onBlurContext}
      className={classNames(className, "enhanced-checkbox")}
    >
      {children}
      <span className="checkbox-description">{description}</span>
    </Checkbox>
  );
}

export function SingleCheckboxFormAccepter({
  value,
  readOnly,
  onBlur,
  onChange,
  name,
  children,
  ...rest
}: FormControlAccepterProps<boolean> & { children: ReactNode }) {
  return (
    <CheckboxGroupContext.Provider
      value={{
        value,
        onChange: (newValue, checked, event) => {
          if (onChange) {
            onChange(checked, event);
          }
        },
        onBlur,
        name,
        readOnly,
      }}
    >
      {children}
    </CheckboxGroupContext.Provider>
  );
}
