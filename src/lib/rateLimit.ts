// In-memory sliding window rate limiter fallback with automatic timestamp pruning

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

export async function rateLimit(
  ip: string,
  limit = 5,
  windowMs = 3600000,
): Promise<{ success: boolean; remaining: number }> {
  const now = Date.now();
  const record = memoryStore.get(ip);

  // Clean expired records periodically
  if (memoryStore.size > 1000) {
    for (const [key, val] of memoryStore.entries()) {
      if (val.resetAt < now) {
        memoryStore.delete(key);
      }
    }
  }

  if (!record || record.resetAt < now) {
    memoryStore.set(ip, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count };
}

export function resetRateLimitForTesting(): void {
  memoryStore.clear();
}
