import { Slider } from "rsuite";
import { useCallback, useState } from "react";

import { StandardProps } from "rsuite/es/@types/common";

export function CustomSlider({
  defaultValue,
  values,
  onChange,
  ...rest
}: {
  defaultValue: string;
  values: string[];
  onChange: (selectedValue: string) => void;
} & StandardProps) {
  const [value, setValue] = useState(values.indexOf(defaultValue));
  const handleChange = useCallback(
    (currentValue: number) => {
      setValue(currentValue);
      onChange(values[currentValue]);
    },
    [onChange, values],
  );

  return (
    <Slider
      {...rest}
      handleStyle={{
        color: "#fff",
        fontSize: 12,
        width: 32,
        height: 22,
      }}
      className="custom-slider"
      min={0}
      max={values.length - 1}
      value={value}
      graduated
      tooltip={false}
      handleTitle={values[value]}
      onChange={handleChange}
    />
  );
}
