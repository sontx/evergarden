export class ThemeManager {
  private static loaded = false;
  private static dark: Element;
  private static light: Element;
  private static current: Element;

  private static load() {
    if (this.loaded) {
      return;
    }

    const themes = document.querySelectorAll(
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

    document.head.removeChild(this.dark);
    document.head.removeChild(this.light);

    this.loaded = true;
  }

  static setTheme(name: "dark" | "light") {
    this.load();

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
}
