import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectIsDarkMode, setDarkMode } from "../globalSlice";
import { useCallback } from "react";

export function useIsDarkMode() {
  const isDarkMode = useAppSelector(selectIsDarkMode);
  const dispatch = useAppDispatch();
  const callback = useCallback(
    (darkMode) => {
      dispatch(setDarkMode(darkMode));
    },
    [dispatch],
  );
  return { isDarkMode, setDarkMode: callback };
}
