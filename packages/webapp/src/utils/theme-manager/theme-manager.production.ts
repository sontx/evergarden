import { IThemeManager } from "./theme-manager.interface";

export class ThemeManagerProduction implements IThemeManager {
  private loaded = false;
  private dark?: string;
  private light?: string;

  private getCurrent(): HTMLStyleElement {
    const head = document.head;
    const allStyles = head.querySelectorAll("link[rel='stylesheet']");
    const current = (Array.from(
      allStyles,
    ) as HTMLStyleElement[]).find((style) =>
      /(dark|light)\.[a-z0-9].+\.css/.test(style.getAttribute("href") || ""),
    );
    if (!current) {
      throw new Error("Root theme link style was not found");
    }
    return current;
  }

  private load() {
    const head = document.head;
    const themeTags = head.querySelectorAll("meta[theme-name]");
    themeTags.forEach((tag) => {
      const name = tag.getAttribute("theme-name");
      const value = tag.getAttribute("value") || "";
      if (name === "dark") {
        this.dark = value;
      } else {
        this.light = value;
      }
    });

    if (!this.dark) {
      throw new Error("Dark theme was not found");
    }
    if (!this.light) {
      throw new Error("Light theme was not found");
    }
  }

  setTheme(name: "dark" | "light"): void {
    if (!this.loaded) {
      this.load();
      this.loaded = true;
    }

    const theme = name === "dark" ? this.dark : this.light;
    if (!theme) {
      throw new Error(`Theme ${name} is not supported`);
    }

    const current = this.getCurrent() as any;
    current.href = theme;
  }
}
