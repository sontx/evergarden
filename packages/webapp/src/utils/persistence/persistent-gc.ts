import { PersistentStorage } from "./persistent-storage";
import ms from "ms";

type Meta = {
  cacheTime?: number;
  registeredTime: number;
  onCollect?: () => void;
};

export class PersistentGC {
  private intervalId: number | undefined;
  private started = false;
  private registeredMap: {
    [x: string]: Meta;
  } = {};

  constructor(private readonly persistentStorage: PersistentStorage) {
    this.register = this.register.bind(this);
    this.collect = this.collect.bind(this);
  }

  register(
    key: string,
    cacheTime: number | string | false,
    onCollect?: () => void,
  ) {
    if (!this.persistentStorage.containsObject(key)) {
      return;
    }

    if (!this.started) {
      this.schedule();
    }

    this.registeredMap[key] = {
      cacheTime:
        typeof cacheTime === "string"
          ? ms(cacheTime)
          : cacheTime === false
          ? undefined
          : cacheTime,
      registeredTime: new Date().getTime(),
      onCollect,
    };

    this.persistDebugInfo({ key, cacheTime });
  }

  collect(key: string) {
    this.doCollect(key);
    this.unscheduleIfNeeded();
    this.persistDebugInfo();
  }

  private persistDebugInfo(data?: any) {
    if (process.env.NODE_ENV === "development") {
      if (data) {
        console.info(
          `Register ${data.key} with cache time is ${data.cacheTime}`,
        );
      }
      localStorage.setItem(
        "persistentGCDebug",
        JSON.stringify(this.registeredMap),
      );
    }
  }

  private schedule() {
    console.info("GC is started");
    this.unschedule();
    this.intervalId = window.setInterval(this.doCheck.bind(this), 1000);
    this.started = true;
  }

  private doCheck() {
    const keys = Object.keys(this.registeredMap);
    const now = new Date().getTime();
    for (const key of keys) {
      const meta = this.registeredMap[key];
      if (meta.cacheTime === undefined) {
        continue;
      }
      if (now - meta.registeredTime >= meta.cacheTime) {
        this.doCollect(key);
      }
    }

    this.unscheduleIfNeeded();
    this.persistDebugInfo();
  }

  private doCollect(key: string) {
    const meta = this.registeredMap[key];
    delete this.registeredMap[key];
    this.persistentStorage.remove(key);
    if (meta.onCollect) {
      meta.onCollect();
    }

    console.info(`Collected ${key}`);
  }

  private unscheduleIfNeeded() {
    if (Object.keys(this.registeredMap).length === 0) {
      this.unschedule();
    }
  }

  private unschedule() {
    if (this.intervalId !== undefined) {
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
      this.started = false;
      console.info("GC is stopped");
    }
  }
}
