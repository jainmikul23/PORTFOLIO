import { test, expect } from "@playwright/test";

test.describe("Scroll-Controlled Cinematic 3D Experience", () => {
  test("mounts the canvas and responds to bidirectional scroll", async ({ page }) => {
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

    // 1. Verify Master Title & Branding
    const masterTitle = page.locator("h1", { hasText: "MIKUL JAIN" });
    await expect(masterTitle).toBeVisible();

    const headline = page.locator("text=DESIGNING THE FUTURE.");
    await expect(headline).toBeVisible();

    // 2. Verify Canvas element exists
    const canvas = page.locator("canvas").first();
    await expect(canvas).toBeVisible();

    // 3. Scroll Down: check that HUD telemetry updates and Stage 2 / 3 appear
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));
    await page.waitForTimeout(600);

    // Stage 2 or 3 should become visible
    const telemetry = page.locator("text=CORE ARCHITECTURE").or(page.locator("text=Turning Complex Architecture"));
    await expect(telemetry.first()).toBeVisible();

    // 4. Scroll Further Down: Stage 3 (Portrait & Credentials)
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2.8));
    await page.waitForTimeout(600);

    const cgpa = page.locator("text=8.22 CGPA");
    await expect(cgpa.first()).toBeVisible();

    // 5. Scroll Reverse (UP): smoothly restores earlier stages
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);

    await expect(masterTitle).toBeVisible();
  });

  test("runs responsive on mobile viewports", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

    const masterTitle = page.locator("h1", { hasText: "MIKUL JAIN" });
    await expect(masterTitle).toBeVisible();

    // Check no horizontal scroll overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});

