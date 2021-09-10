import { IThemeManager } from "./theme-manager.interface";
import { ThemeManagerProduction } from "./theme-manager.production";
import { ThemeManagerDevelopment } from "./theme-manager.development";

export class ThemeManager implements IThemeManager {
  static readonly defaultInstance = new ThemeManager();

  private readonly manager: IThemeManager =
    process.env.NODE_ENV !== "development"
      ? new ThemeManagerProduction()
      : new ThemeManagerDevelopment();

  setTheme(name: "dark" | "light"): void {
    this.manager.setTheme(name);
  }
}
