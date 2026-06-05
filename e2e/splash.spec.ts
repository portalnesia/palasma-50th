import { test, expect } from "@playwright/test";

test.describe("Splash Screen", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#splash");
  });

  test("shows full-screen splash section", async ({ page }) => {
    const splash = page.locator("#splash");
    await expect(splash).toBeVisible();
    await expect(splash).toHaveClass(/splash-section/);
  });

  test("displays title and subtitle from config", async ({ page }) => {
    await expect(page.locator(".splash-title")).toContainText("PALASMA 50 Tahun");
    await expect(page.locator(".splash-subtitle")).toContainText("Setengah Abad Alam");
  });

  test("shows default recipient name", async ({ page }) => {
    await expect(page.locator("#splash-recipient-name")).toContainText("Abang / Mba");
  });

  test("updates recipient name from ?to= query param", async ({ page }) => {
    await page.goto("/?to=Budi%20Santoso");
    await page.waitForSelector("#splash");
    await expect(page.locator("#splash-recipient-name")).toContainText("Budi Santoso");
  });

  test("shows greeting above recipient", async ({ page }) => {
    await expect(page.locator(".splash-greeting")).toContainText("Kepada Yth.");
  });

  test("Buka Undangan button exists and is clickable", async ({ page }) => {
    const cta = page.locator("#splash-cta");
    await expect(cta).toBeVisible();
    await expect(cta).toContainText("Buka Undangan");
  });

  test("music toggle button exists", async ({ page }) => {
    const toggle = page.locator("#music-toggle");
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-label", "Toggle musik latar");
  });

  test("background image is loaded", async ({ page }) => {
    const img = page.locator(".splash-bg-img");
    await expect(img).toBeAttached();
    const naturalWidth = await img.evaluate((el) => (el as HTMLImageElement).naturalWidth);
    expect(naturalWidth).toBeGreaterThanOrEqual(0);
  });

  test("no countdown visible in splash", async ({ page }) => {
    const countdown = page.locator("#countdown");
    await expect(countdown).toHaveCount(0);
  });
});

test.describe("Hero Section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#splash");
    await page.click("#splash-cta");
    await page.waitForTimeout(1500);
  });

  test("hero section becomes visible after clicking Buka Undangan", async ({ page }) => {
    const hero = page.locator("#hero");
    await expect(hero).toBeVisible();
  });

  test("hero shows 50 emblem", async ({ page }) => {
    await expect(page.locator(".hero-emblem-ring span")).toContainText("50");
  });

  test("hero shows welcome title from config", async ({ page }) => {
    await expect(page.locator(".hero-title")).toContainText("Selamat Datang");
  });

  test("hero shows tagline from config", async ({ page }) => {
    await expect(page.locator(".hero-title")).toContainText("Reuni Akbar PALASMA");
  });

  test("hero shows Reuni Akbar badge", async ({ page }) => {
    await expect(page.locator(".hero-badge")).toContainText("Reuni Akbar");
  });

  test("hero shows subtitle from config", async ({ page }) => {
    await expect(page.locator(".hero-subtitle")).toContainText("Setengah abad perjalanan");
  });

  test("hero does NOT have RSVP buttons", async ({ page }) => {
    const hero = page.locator("#hero");
    await expect(hero.locator('a:has-text("Hadir")')).toHaveCount(0);
    await expect(hero.locator('a:has-text("Absen")')).toHaveCount(0);
  });

  test("hero does NOT have Buka Undangan button", async ({ page }) => {
    const hero = page.locator("#hero");
    await expect(hero.locator('text="Buka Undangan"')).toHaveCount(0);
  });

  test("hero does NOT display event date / time / location", async ({ page }) => {
    const hero = page.locator("#hero");
    await expect(hero.locator('text="Sabtu"')).toHaveCount(0);
    await expect(hero.locator('text="WITA"')).toHaveCount(0);
    await expect(hero.locator('text="Aranka"')).toHaveCount(0);
  });

  test("hero does NOT display year / timeline label", async ({ page }) => {
    const hero = page.locator("#hero");
    await expect(hero.locator(".hero-year-text")).toHaveCount(0);
  });

  test("hero background image loads", async ({ page }) => {
    const img = page.locator(".hero-bg-img");
    await expect(img).toBeAttached();
    const naturalWidth = await img.evaluate((el) => (el as HTMLImageElement).naturalWidth);
    expect(naturalWidth).toBeGreaterThanOrEqual(0);
  });

  test("hero section has floating particles", async ({ page }) => {
    const hero = page.locator("#hero");
    await expect(hero.locator(".hero-particle")).toHaveCount(6);
  });

  test("hero has spacer for scroll animation room", async ({ page }) => {
    const hero = page.locator("#hero");
    await expect(hero.locator(".hero-spacer")).toBeAttached();
  });
});
