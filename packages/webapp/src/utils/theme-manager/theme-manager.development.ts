import { IThemeManager } from "./theme-manager.interface";

export class ThemeManagerDevelopment implements IThemeManager {
  private loaded = false;
  private dark?: Element;
  private light?: Element;
  private current?: Element;

  setTheme(name: "dark" | "light") {
    if (!this.loaded) {
      this.load();
      this.loaded = true;
    }

    const theme = name === "dark" ? this.dark : this.light;
    if (!theme) {
      throw new Error(`Theme ${name} is not supported`);
    }

    if (theme === this.current) {
      return;
    }

    const head = document.head;
    head.appendChild(theme);
    if (this.current) {
      head.removeChild(this.current);
    }
    this.current = theme;
  }

  private load() {
    const head = document.head;

    const themes = head.querySelectorAll(
      "style[theme-locator='__injected-theme']",
    );
    (Array.from(themes) as HTMLElement[]).forEach((theme) => {
      if (theme.innerText.includes("dark-theme--locator")) {
        this.dark = theme;
      } else if (theme.innerText.includes("light-theme--locator")) {
        this.light = theme;
      }
    });

    if (!this.dark) {
      throw new Error("dark-theme--locator was not found");
    }

    if (!this.light) {
      throw new Error("light-theme--locator was not found");
    }

    console.log(this.dark);
    console.log(this.light);

    head.removeChild(this.dark);
    head.removeChild(this.light);
  }
}
