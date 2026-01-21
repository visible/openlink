type CacheEntry<T> = {
  data: T
  createdAt: number
  ttl: number
}

const store = new Map<string, CacheEntry<unknown>>()
const refreshLocks = new Map<string, number>()

const REFRESH_COOLDOWN = 10 * 60 * 1000

export function parseTTL(ttl: string | null): number {
  if (!ttl) return 0

  const match = ttl.match(/^(\d+)(s|m|h|d)?$/)
  if (!match) return 0

  const value = parseInt(match[1])
  const unit = match[2] || "s"

  switch (unit) {
    case "s": return value * 1000
    case "m": return value * 60 * 1000
    case "h": return value * 60 * 60 * 1000
    case "d": return value * 24 * 60 * 60 * 1000
    default: return value * 1000
  }
}

export function formatTTL(ms: number): string {
  if (ms >= 86400000) return `${Math.round(ms / 86400000)}d`
  if (ms >= 3600000) return `${Math.round(ms / 3600000)}h`
  if (ms >= 60000) return `${Math.round(ms / 60000)}m`
  return `${Math.round(ms / 1000)}s`
}

export type CacheResult<T> = {
  data: T
  status: "HIT" | "MISS" | "STALE" | "BYPASS"
  age: number
  ttl: number
}

export async function cached<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    ttl: number
    fresh?: boolean
    staleWhileRevalidate?: boolean
  }
): Promise<CacheResult<T>> {
  const { ttl, fresh = false, staleWhileRevalidate = true } = options
  const now = Date.now()

  if (fresh) {
    const lastRefresh = refreshLocks.get(key) || 0
    if (now - lastRefresh < REFRESH_COOLDOWN) {
      const entry = store.get(key) as CacheEntry<T> | undefined
      if (entry) {
        return {
          data: entry.data,
          status: "HIT",
          age: now - entry.createdAt,
          ttl: entry.ttl,
        }
      }
    }

    refreshLocks.set(key, now)
    const data = await fetcher()
    store.set(key, { data, createdAt: now, ttl })

    return {
      data,
      status: "BYPASS",
      age: 0,
      ttl,
    }
  }

  const entry = store.get(key) as CacheEntry<T> | undefined

  if (entry) {
    const age = now - entry.createdAt
    const isExpired = age > entry.ttl

    if (!isExpired) {
      return {
        data: entry.data,
        status: "HIT",
        age,
        ttl: entry.ttl,
      }
    }

    if (staleWhileRevalidate) {
      fetcher().then((data) => {
        store.set(key, { data, createdAt: Date.now(), ttl })
      }).catch(() => {})

      return {
        data: entry.data,
        status: "STALE",
        age,
        ttl: entry.ttl,
      }
    }
  }

  const data = await fetcher()
  store.set(key, { data, createdAt: now, ttl })

  return {
    data,
    status: "MISS",
    age: 0,
    ttl,
  }
}

export function getCacheStats() {
  const entries = Array.from(store.entries())
  const now = Date.now()

  return {
    size: store.size,
    entries: entries.map(([key, entry]) => ({
      key,
      age: now - entry.createdAt,
      ttl: entry.ttl,
      expired: now - entry.createdAt > entry.ttl,
    })),
  }
}

export function clearCache(pattern?: string) {
  if (!pattern) {
    store.clear()
    return
  }

  for (const key of store.keys()) {
    if (key.includes(pattern)) {
      store.delete(key)
    }
  }
}
