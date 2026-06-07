import { test, expect } from "@playwright/test";

test.describe("Hero Section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#hero");
  });

  /* ── Structure ──────────────────────────────────────────── */

  test("section exists with correct id and class", async ({ page }) => {
    const hero = page.locator("#hero");
    await expect(hero).toBeAttached();
    await expect(hero).toHaveClass(/hero-section/);
  });

  test("section fills the viewport", async ({ page }) => {
    const hero = page.locator("#hero");
    const box = await hero.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(600);
  });

  /* ── Background layers ──────────────────────────────────── */

  test("has background container", async ({ page }) => {
    await expect(page.locator("#hero .hero-bg")).toBeAttached();
  });

  test("has 4 gradient layers", async ({ page }) => {
    const gradients = page.locator("#hero .hero-bg > div[class*='hero-bg-gradient']");
    await expect(gradients).toHaveCount(4);
  });

  test("has grain overlay", async ({ page }) => {
    await expect(page.locator("#hero .hero-bg-grain")).toBeAttached();
  });

  /* ── Decorative elements ────────────────────────────────── */

  test("has 5 bokeh orbs", async ({ page }) => {
    await expect(page.locator("#hero .hero-bokeh-orb")).toHaveCount(5);
  });

  test("has 6 sparkles", async ({ page }) => {
    await expect(page.locator("#hero .hero-sparkle")).toHaveCount(6);
  });

  test("has 10 confetti pieces", async ({ page }) => {
    await expect(page.locator("#hero .hero-confetti-piece")).toHaveCount(10);
  });

  /* ── Content ────────────────────────────────────────────── */

  test("content container exists", async ({ page }) => {
    await expect(page.locator("#hero-content")).toBeAttached();
  });

  test("displays welcome badge", async ({ page }) => {
    const badge = page.locator("[data-hero='badge']");
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText("Selamat Datang");
  });

  test("displays tagline split into lines", async ({ page }) => {
    const lines = page.locator("[data-hero^='title-line-1'], [data-hero^='title-line-2']");
    const count = await lines.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test("first tagline line contains 'Reuni Akbar'", async ({ page }) => {
    const line1 = page.locator("[data-hero='title-line-1']");
    await expect(line1).toContainText("Reuni Akbar");
  });

  test("second tagline line contains 'PENCINTA ALAM'", async ({ page }) => {
    const line2 = page.locator("[data-hero='title-line-2']");
    await expect(line2).toContainText("PENCINTA ALAM");
  });

  test("subtitle line exists with descriptive text", async ({ page }) => {
    const subtitle = page.locator("[data-hero='title-line-3']");
    await expect(subtitle).toBeAttached();
    await expect(subtitle).toContainText("Setengah abad");
  });

  /* ── Mountain silhouettes ───────────────────────────────── */

  test("mountain silhouette image exists", async ({ page }) => {
    const mountain = page.locator("#hero .hero-mountain");
    await expect(mountain).toBeAttached();
    await expect(mountain).toHaveAttribute("src", "/assets/images/mountains.png");
  });

  test("mountain image is decorative (empty alt)", async ({ page }) => {
    const mountain = page.locator("#hero .hero-mountain");
    await expect(mountain).toHaveAttribute("alt", "");
  });

  /* ── Spacer ─────────────────────────────────────────────── */

  test("spacer element exists for layout", async ({ page }) => {
    await expect(page.locator("#hero .hero-spacer")).toBeAttached();
  });

  /* ── Accessibility ──────────────────────────────────────── */

  test("decorative elements are hidden from assistive tech", async ({ page }) => {
    const decorative = page.locator("#hero [aria-hidden='true']");
    const count = await decorative.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });
});
