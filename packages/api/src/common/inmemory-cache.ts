import Timeout = NodeJS.Timeout;

interface CacheDataMeta {
  /**
   * Time to live in milliseconds
   */
  ttl?: number;
}

interface CacheDataValue {
  value: any;
  meta: CacheDataMeta;
  cachedAt: Date;
}

export class InmemoryCache {
  private cleanupInternal: Timeout;

  private readonly cacheData: {
    [x: string]: CacheDataValue;
  } = {};

  start() {
    this.stop();
    this.cleanupInternal = setInterval(this.doCleanup.bind(this), 1000);
  }

  stop() {
    if (this.cleanupInternal !== undefined) {
      clearInterval(this.cleanupInternal);
      this.cleanupInternal = undefined;
    }
  }

  set(key: string, value: any, meta?: CacheDataMeta) {
    this.cacheData[key] = {
      value,
      meta: meta || {},
      cachedAt: new Date(),
    };
  }

  get<T extends any>(key: string): T {
    return this.cacheData[key]?.value;
  }

  pop<T extends any>(key: string): T {
    const value = this.get<T>(key);
    delete this.cacheData[key];
    return value;
  }

  private doCleanup() {
    const now = new Date().getTime();
    for (const key of Object.keys(this.cacheData)) {
      const { meta, cachedAt } = this.cacheData[key];
      if (meta.ttl !== undefined && cachedAt.getTime() + meta.ttl <= now) {
        delete this.cacheData[key];
      }
    }
  }
}
