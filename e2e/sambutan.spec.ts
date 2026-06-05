import { test, expect } from "@playwright/test";

test.describe("Kata Sambutan Section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#sambutan");
  });

  test("section exists with correct id and class", async ({ page }) => {
    const section = page.locator("#sambutan");
    await expect(section).toBeAttached();
    await expect(section).toHaveClass(/sambutan-section/);
  });

  test("displays title", async ({ page }) => {
    await expect(page.locator(".sambutan-title")).toContainText("Kata Sambutan");
  });

  test("displays author name", async ({ page }) => {
    await expect(page.locator(".sambutan-author-name")).toContainText("Panitia");
  });

  test("displays author role", async ({ page }) => {
    await expect(page.locator(".sambutan-author-role")).toContainText("HUT ke-50 PALASMA");
  });

  test("displays photo with correct alt text", async ({ page }) => {
    const photo = page.locator(".sambutan-photo");
    await expect(photo).toBeAttached();
    await expect(photo).toHaveAttribute("alt", "Logo 50th Palasma");
  });

  test("photo loads from config path", async ({ page }) => {
    const photo = page.locator(".sambutan-photo");
    await expect(photo).toHaveAttribute("src", "/assets/images/logo-50.png");
  });

  test("body contains greeting text", async ({ page }) => {
    const body = page.locator(".sambutan-body-text");
    await expect(body).toContainText("Assalamualaikum");
  });

  test("body contains closing text", async ({ page }) => {
    const body = page.locator(".sambutan-body-text");
    await expect(body).toContainText("Panitia HUT ke-50 PALASMA");
  });

  test("body paragraphs are rendered", async ({ page }) => {
    const paragraphs = page.locator(".sambutan-paragraph");
    const count = await paragraphs.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("quote marks are present", async ({ page }) => {
    const openQuote = page.locator(".sambutan-quote-open");
    const closeQuote = page.locator(".sambutan-quote-close");
    await expect(openQuote).toBeAttached();
    await expect(closeQuote).toBeAttached();
    await expect(openQuote).toContainText("❝");
    await expect(closeQuote).toContainText("❞");
  });

  test("glass card with corner ornaments exist", async ({ page }) => {
    await expect(page.locator(".sambutan-glass-card")).toBeAttached();
    await expect(page.locator(".sambutan-corner-tl")).toBeAttached();
    await expect(page.locator(".sambutan-corner-br")).toBeAttached();
  });

  test("floating particles are present", async ({ page }) => {
    const particles = page.locator(".sambutan-particle");
    const count = await particles.count();
    expect(count).toBeGreaterThanOrEqual(8);
  });

  test("photo glow and ring elements exist", async ({ page }) => {
    await expect(page.locator(".sambutan-photo-glow")).toBeAttached();
    await expect(page.locator(".sambutan-photo-ring-outer")).toBeAttached();
    await expect(page.locator(".sambutan-photo-ring-inner")).toBeAttached();
  });

  test("ornamental flourishes exist", async ({ page }) => {
    await expect(page.locator(".sambutan-ornament-bottom")).toBeAttached();
    const flourishes = page.locator(".sambutan-flourish");
    await expect(flourishes).toHaveCount(2);
  });

  test("author divider line exists", async ({ page }) => {
    await expect(page.locator(".sambutan-author-divider")).toBeAttached();
  });
});
