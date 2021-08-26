import { FormControlAccepterProps } from "rsuite/lib/FormControl/FormControl";
import React, { createContext, ReactNode } from "react";

export const SingleCheckboxGroupContext = createContext<{
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
    <SingleCheckboxGroupContext.Provider
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
    </SingleCheckboxGroupContext.Provider>
  );
}
