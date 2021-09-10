import { PersistentGC } from "./persistent-gc";
import { PersistentStorage } from "./persistent-storage";

export class PersistentManager {
  static readonly defaultInstance = new PersistentManager();

  private readonly gc: PersistentGC;
  private readonly storage: PersistentStorage;

  constructor() {
    this.storage = new PersistentStorage();
    this.gc = new PersistentGC(this.storage);

    this.getObject = this.getObject.bind(this);
    this.persist = this.persist.bind(this);
    this.remove = this.remove.bind(this);
    this.containsObject = this.containsObject.bind(this);
  }

  getObject<T>(key: string, defaultValue?: T): T | undefined {
    return this.storage.getObject(key, defaultValue);
  }

  persist(
    key: string,
    value: any,
    cacheTime: number | string | false,
    onCollect?: () => void,
  ) {
    if (key) {
      if (this.storage.persist(key, value)) {
        this.gc.register(key, cacheTime, onCollect);
      }
    }
  }

  remove(key: string) {
    if (key) {
      this.storage.remove(key);
      this.gc.collect(key);
    }
  }

  containsObject(key: string) {
    return this.storage.containsObject(key);
  }
}
