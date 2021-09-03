import { ReactElement, useEffect } from "react";
import { ThemeManager } from "./utils/theme-manager/theme-manager";
import { useAppSelector } from "./app/hooks";
import { selectIsDarkMode } from "./features/global/globalSlice";

export function ThemeProvider({ children }: { children: ReactElement }) {
  const isDarkMode = useAppSelector(selectIsDarkMode);
  useEffect(() => {
    ThemeManager.defaultInstance.setTheme(isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return children;
}
