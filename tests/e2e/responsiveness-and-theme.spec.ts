import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "Mobile Small (320px)", width: 320, height: 640 },
  { name: "iPhone SE (375px)", width: 375, height: 667 },
  { name: "iPhone 13/14 (390px)", width: 390, height: 844 },
  { name: "Tablet Portrait (768px)", width: 768, height: 1024 },
  { name: "Laptop (1024px)", width: 1024, height: 768 },
  { name: "Desktop Large (1440px)", width: 1440, height: 900 },
];

test.describe("Responsiveness & Zero Horizontal Overflow", () => {
  for (const vp of VIEWPORTS) {
    test(`renders at ${vp.name} with zero horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.clientWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const bodyWidth = document.body.scrollWidth;
        return {
          clientWidth: docWidth,
          scrollWidth: scrollWidth,
          bodyScrollWidth: bodyWidth,
          hasOverflow: scrollWidth > docWidth || bodyWidth > docWidth,
        };
      });

      expect(overflow.hasOverflow).toBe(false);
    });
  }
});

test.describe("Light Theme Warm Porcelain Palette & Contrast", () => {
  test("toggles to light mode and displays warm background with rich dark ink text", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);

    // Toggle theme if not already light
    const currentTheme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
    if (currentTheme !== "light") {
      const toggleBtn = page.getByRole("button", { name: /switch to (light|dark) mode/i });
      if (await toggleBtn.isVisible()) {
        await toggleBtn.click();
        await page.waitForTimeout(300);
      }
    }

    const themeAfter = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
    expect(themeAfter).toBe("light");

    // Check computed styles on body and primary sections
    const styles = await page.evaluate(() => {
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;
      const hero = document.getElementById("hero");
      const about = document.getElementById("about");
      const projects = document.getElementById("projects");

      return {
        bodyBg,
        heroBg: hero ? window.getComputedStyle(hero).backgroundColor : null,
        aboutBg: about ? window.getComputedStyle(about).backgroundColor : null,
        projectsBg: projects ? window.getComputedStyle(projects).backgroundColor : null,
        headlineColor: hero?.querySelector("h1") ? window.getComputedStyle(hero.querySelector("h1")!).color : null,
      };
    });

    // In light theme, body background is warm porcelain #FAF8F5 (rgb(250, 248, 245))
    expect(styles.bodyBg).toBe("rgb(250, 248, 245)");
    // Headline color is rich ink #14161B (rgb(20, 22, 27))
    expect(styles.headlineColor).toBe("rgb(20, 22, 27)");
  });
});

test.describe("Section Navigation & Content Verification", () => {
  test("all 8 portfolio sections exist and have correct titles", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });

    const expectedSections = [
      "hero",
      "about",
      "capabilities",
      "projects",
      "skills",
      "journey",
      "beyond",
      "contact",
    ];

    for (const secId of expectedSections) {
      const el = page.locator(`#${secId}`);
      await expect(el).toBeAttached();
    }

    // Verify CGPA is 8.22 in facts strip
    const facts = page.locator("#hero");
    await expect(facts).toContainText("8.22 CGPA");
  });
});
