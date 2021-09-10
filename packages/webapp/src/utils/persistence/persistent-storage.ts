export class PersistentStorage {
  getObject<T>(key: string, defaultValue?: T): T | undefined {
    const data = localStorage.getItem(key);
    if (data === undefined || data === null) {
      return defaultValue;
    }
    return JSON.parse(data) as T;
  }

  persist(key: string, value: any): boolean {
    if (value === undefined || value === null) {
      this.remove(key);
      return false;
    } else {
      localStorage.setItem(
        key,
        typeof value === "string" ? value : JSON.stringify(value),
      );
      return true;
    }
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  containsObject(key: string) {
    try {
      const obj = this.getObject(key);
      return typeof obj === "object";
    } catch {
      return false;
    }
  }
}
