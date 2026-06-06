import { test, expect } from "@playwright/test";

test.describe("Twibbon Section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#twibbon");
  });

  /* ── Structure ──────────────────────────────────────────── */

  test("section exists with correct id and class", async ({ page }) => {
    const section = page.locator("#twibbon");
    await expect(section).toBeAttached();
    await expect(section).toHaveClass(/twibbon-section/);
  });

  /* ── Background layers ──────────────────────────────────── */

  test("has background container", async ({ page }) => {
    await expect(page.locator("#twibbon .twibbon-bg")).toBeAttached();
  });

  test("has 3 gradient layers", async ({ page }) => {
    const gradients = page.locator("#twibbon .twibbon-bg > div[class*='twibbon-bg-gradient']");
    await expect(gradients).toHaveCount(3);
  });

  test("has grain overlay", async ({ page }) => {
    await expect(page.locator("#twibbon .twibbon-bg-grain")).toBeAttached();
  });

  /* ── Decorative elements ────────────────────────────────── */

  test("has 6 floating gold particles", async ({ page }) => {
    await expect(page.locator("#twibbon .twibbon-particle")).toHaveCount(6);
  });

  test("has left and right side decorations", async ({ page }) => {
    await expect(page.locator("#twibbon .twibbon-side-left")).toBeAttached();
    await expect(page.locator("#twibbon .twibbon-side-right")).toBeAttached();
  });

  /* ── Content ────────────────────────────────────────────── */

  test("displays title with 'Twibbon' text", async ({ page }) => {
    const title = page.locator(".twibbon-title-text");
    await expect(title).toContainText("Twibbon 50th PALASMA");
  });

  test("title has decorative star characters", async ({ page }) => {
    const stars = page.locator(".twibbon-title-star");
    await expect(stars).toHaveCount(2);
  });

  test("displays subtitle from config", async ({ page }) => {
    await expect(page.locator(".twibbon-subtitle")).toContainText("Tunjukkan semangatmu");
  });

  test("displays body / persuasive text", async ({ page }) => {
    await expect(page.locator(".twibbon-body")).toContainText("Rancang Twibbon Anda sendiri");
  });

  /* ── Glass card & corners ───────────────────────────────── */

  test("glass card container exists", async ({ page }) => {
    await expect(page.locator(".twibbon-glass-border")).toBeAttached();
  });

  test("has 4 corner ornaments", async ({ page }) => {
    const corners = page.locator(".twibbon-corner");
    await expect(corners).toHaveCount(4);
  });

  /* ── Preview / upload area ──────────────────────────────── */

  test("preview area exists", async ({ page }) => {
    await expect(page.locator("#twibbon-preview")).toBeAttached();
  });

  test("preview shows placeholder icon", async ({ page }) => {
    await expect(page.locator(".twibbon-preview-icon")).toBeAttached();
  });

  test("preview shows 'Pratinjau Twibbon' text", async ({ page }) => {
    await expect(page.locator(".twibbon-preview-text")).toHaveText("Pratinjau Twibbon");
  });

  test("preview shows size hint", async ({ page }) => {
    await expect(page.locator(".twibbon-preview-hint")).toContainText("1000×1000");
  });

  test("upload label shows correct CTA text", async ({ page }) => {
    await expect(page.locator("#twibbon-upload-label")).toContainText("Pilih Foto");
  });

  test("file input accepts image types", async ({ page }) => {
    const input = page.locator("#twibbon-file-input");
    await expect(input).toHaveAttribute("accept", "image/jpeg,image/png,image/webp,image/gif");
  });

  /* ── Croppie container (hidden) ─────────────────────────── */

  test("croppie container exists", async ({ page }) => {
    await expect(page.locator("#twibbon-croppie")).toBeAttached();
  });

  /* ── Hidden canvas for compositing ──────────────────────── */

  test("compositing canvas exists with 1000×1000 dimensions", async ({ page }) => {
    const canvas = page.locator("#twibbon-canvas");
    await expect(canvas).toBeAttached();
    await expect(canvas).toHaveAttribute("width", "1000");
    await expect(canvas).toHaveAttribute("height", "1000");
  });

  test("canvas has frame data attribute", async ({ page }) => {
    const canvas = page.locator("#twibbon-canvas");
    const frame = await canvas.getAttribute("data-frame");
    expect(frame).toBeTruthy();
    expect(frame).toContain("twibbon.png");
  });

  /* ── Controls (hidden initially) ────────────────────────── */

  test("controls container exists", async ({ page }) => {
    await expect(page.locator("#twibbon-controls")).toBeAttached();
  });

  test("download button exists", async ({ page }) => {
    const btn = page.locator("#twibbon-btn-download");
    await expect(btn).toBeAttached();
    await expect(btn).toContainText("Download");
  });

  test("reset button exists", async ({ page }) => {
    const btn = page.locator("#twibbon-btn-reset");
    await expect(btn).toBeAttached();
    await expect(btn).toContainText("Ulangi");
  });

  /* ── Status & privacy ───────────────────────────────────── */

  test("status message element exists", async ({ page }) => {
    await expect(page.locator("#twibbon-status")).toBeAttached();
  });

  test("privacy notice displays client-side processing text", async ({ page }) => {
    await expect(page.locator(".twibbon-privacy")).toContainText(
      "Semua proses dilakukan di browser Anda",
    );
  });

  /* ── Ornamental flourishes ───────────────────────────────── */

  test("top ornamental flourish exists", async ({ page }) => {
    await expect(page.locator(".twibbon-ornament-top")).toBeAttached();
  });

  test("bottom ornamental flourish exists", async ({ page }) => {
    await expect(page.locator(".twibbon-ornament-bottom")).toBeAttached();
  });

  /* ── Accessibility ──────────────────────────────────────── */

  test("decorative elements are hidden from assistive tech", async ({ page }) => {
    const decorative = page.locator("#twibbon [aria-hidden='true']");
    const count = await decorative.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test("file input has aria-label", async ({ page }) => {
    await expect(page.locator("#twibbon-file-input")).toHaveAttribute(
      "aria-label",
      "Upload foto untuk twibbon",
    );
  });
});
