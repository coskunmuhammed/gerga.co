export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
}

export interface RateLimiter {
  consume(key: string): Promise<RateLimitResult>;
}

export class MemoryRateLimiter implements RateLimiter {
  private hits: Map<string, { count: number; resetTime: number }> = new Map();
  private maxHits: number;
  private windowMs: number;

  constructor(maxHits: number = 5, windowSeconds: number = 60) {
    this.maxHits = maxHits;
    this.windowMs = windowSeconds * 1000;
  }

  async consume(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const entry = this.hits.get(key);

    if (!entry || now > entry.resetTime) {
      this.hits.set(key, { count: 1, resetTime: now + this.windowMs });
      return { allowed: true };
    }

    if (entry.count >= this.maxHits) {
      const retryAfterSeconds = Math.ceil((entry.resetTime - now) / 1000);
      return { allowed: false, retryAfterSeconds };
    }

    entry.count += 1;
    return { allowed: true };
  }
}
