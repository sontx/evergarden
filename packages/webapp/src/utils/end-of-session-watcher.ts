export class EndOfSessionWatcher {
  static readonly instance: EndOfSessionWatcher = new EndOfSessionWatcher();

  private callbacks: (() => void)[] = [];

  constructor() {
    document.addEventListener(
      "visibilitychange",
      this.onVisibleChanged.bind(this),
    );
    window.addEventListener("beforeunload", this.onBeforeUnload.bind(this));
    this.register = this.register.bind(this);
    this.unregister = this.unregister.bind(this);
    this.doCallback = this.doCallback.bind(this);
  }

  register(callback: () => void): void {
    if (this.callbacks.indexOf(callback) === -1) {
      this.callbacks.push(callback);
    }
  }

  unregister(callback: () => void): void {
    this.callbacks = this.callbacks.filter((item) => item !== callback);
  }

  private onVisibleChanged() {
    if (document.visibilityState === "hidden") {
      this.doCallback();
    }
  }

  private onBeforeUnload() {
    this.doCallback();
  }

  private doCallback(): void {
    for (const callback of this.callbacks) {
      callback();
    }
  }
}
