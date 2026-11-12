import { describe, it, expect } from "vitest";

describe("Environment & Setup", () => {
  it("has valid Node environment", () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });
});
