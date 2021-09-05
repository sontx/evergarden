import { useCallback, useState } from "react";

export function useToggle(
  initialValue?: boolean,
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(!!initialValue);
  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);
  return [value, toggle, setValue];
}
