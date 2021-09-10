import { ReactElement, useEffect } from "react";
import { ThemeManager } from "./utils/theme-manager/theme-manager";
import { useIsDarkMode } from "./features/global/hooks/useIsDarkMode";

export function ThemeProvider({ children }: { children: ReactElement }) {
  const { isDarkMode } = useIsDarkMode();
  useEffect(() => {
    ThemeManager.defaultInstance.setTheme(isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return children;
}
