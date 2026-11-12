import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit, resetRateLimitForTesting } from "@/lib/rateLimit";

describe("Rate Limiting Service", () => {
  beforeEach(() => {
    resetRateLimitForTesting();
  });

  it("permits initial requests below the limit", async () => {
    const res = await rateLimit("192.168.1.1", 5, 60000);
    expect(res.success).toBe(true);
    expect(res.remaining).toBe(4);
  });

  it("blocks requests that exceed the limit", async () => {
    const ip = "192.168.1.2";
    for (let i = 0; i < 5; i++) {
      const res = await rateLimit(ip, 5, 60000);
      expect(res.success).toBe(true);
    }
    const blocked = await rateLimit(ip, 5, 60000);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });
});
