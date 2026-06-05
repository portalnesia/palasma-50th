import { test, expect } from "@playwright/test";

test.describe("Splash Screen", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#splash");
  });

  test("has full-screen layout", async ({ page }) => {
    const splash = page.locator("#splash");
    await expect(splash).toBeVisible();
    await expect(splash).toHaveClass(/splash-screen/);
  });

  test("displays anniversary and title", async ({ page }) => {
    await expect(page.locator(".splash-emblem")).toBeAttached();
    await expect(page.locator(".splash-anniversary")).toHaveText("50");
    await expect(page.locator(".splash-title")).toHaveText("Tahun");
    await expect(page.locator(".splash-subtitle")).toHaveText("PALASMA");
    await expect(page.locator(".splash-tagline")).toContainText("Yang Terhormat");
  });

  test("shows default recipient name", async ({ page }) => {
    await expect(page.locator(".splash-recipient")).toContainText("Abang / Mba");
  });

  test("updates recipient name from ?to= query param", async ({ page }) => {
    // Client-side JS reads the query param and updates the recipient element
    await page.goto("/?to=Budi");
    await page.waitForSelector("#splash");
    // Wait for potential client-side update
    await page.waitForTimeout(500);
    await expect(page.locator(".splash-recipient")).toContainText("Budi");
  });

  test("shows recipient name for given query param", async ({ page }) => {
    await page.goto("/?to=Abang");
    await page.waitForSelector("#splash");
    await page.waitForTimeout(500);
    await expect(page.locator(".splash-recipient")).toContainText("Abang");
  });

  test("cta button present and links to hero", async ({ page }) => {
    const cta = page.locator(".splash-cta");
    await expect(cta).toBeVisible();
    await expect(cta).toContainText("Buka Undangan");
    await expect(cta).toHaveAttribute("href", "#hero");
  });

  test("cta click scrolls page down", async ({ page }) => {
    const scrollYBefore = await page.evaluate(() => window.scrollY);
    await page.click(".splash-cta");
    // Wait for GSAP scroll animation
    await page.waitForTimeout(1500);
    const scrollYAfter = await page.evaluate(() => window.scrollY);
    expect(scrollYAfter).toBeGreaterThan(scrollYBefore);
  });

  test("hero has expected structure", async ({ page }) => {
    const hero = page.locator("#hero");
    await expect(hero).toHaveClass(/hero-section/);
    await expect(hero.locator(".hero-bg")).toBeAttached();
    await expect(hero.locator(".hero-content")).toBeAttached();
    await expect(hero.locator(".hero-spacer")).toBeAttached();
  });

  test("hero has bokeh orbs", async ({ page }) => {
    const hero = page.locator("#hero");
    await expect(hero.locator(".hero-bokeh-orb")).toHaveCount(5);
  });

  test("hero has sparkles", async ({ page }) => {
    const hero = page.locator("#hero");
    await expect(hero.locator(".hero-sparkle")).toHaveCount(6);
  });

  test("hero has confetti pieces", async ({ page }) => {
    const hero = page.locator("#hero");
    await expect(hero.locator(".hero-confetti-piece")).toHaveCount(10);
  });
});
