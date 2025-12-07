import { redis } from "./redis";

export class CacheService {
  // get or set pattern
  static async getOrSet<T>(
    key: string,
    ttlSeconds: number,
    fetchFn: () => Promise<T>
  ) {
    const cached = await redis.get<string>(key);
    if (cached) {
      try {
        return JSON.parse(cached) as T;
      } catch {
        /* fallthrough to fetch */
      }
    }

    const fresh = await fetchFn();
    try {
      await redis.set(key, JSON.stringify(fresh), { ex: ttlSeconds });
    } catch (err) {
      // non-fatal: log or ignore — Upstash may fail occasionally
      console.error("Upstash set error", err);
    }
    return fresh;
  }

  static async writeThrough<T>(key: string, value: T, ttlSeconds = 300) {
    await redis.set(key, JSON.stringify(value), { ex: ttlSeconds });
  }

  static async invalidate(key: string) {
    await redis.del(key);
  }
}
