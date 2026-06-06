import { test, expect } from "@playwright/test";

test.describe("Ucapan & Doa Section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#ucapan-doa");
  });

  /* ── Structure ──────────────────────────────────────────── */

  test("section exists with correct id and class", async ({ page }) => {
    const section = page.locator("#ucapan-doa");
    await expect(section).toBeAttached();
    await expect(section).toHaveClass(/ucapan-section/);
  });

  /* ── Background layers ──────────────────────────────────── */

  test("has background container", async ({ page }) => {
    await expect(page.locator("#ucapan-doa .ucapan-bg")).toBeAttached();
  });

  test("has 3 gradient layers", async ({ page }) => {
    const gradients = page.locator("#ucapan-doa .ucapan-bg > div[class*='ucapan-bg-gradient']");
    await expect(gradients).toHaveCount(3);
  });

  test("has grain overlay", async ({ page }) => {
    await expect(page.locator("#ucapan-doa .ucapan-bg-grain")).toBeAttached();
  });

  /* ── Decorative elements ────────────────────────────────── */

  test("has floating gold particles", async ({ page }) => {
    const particles = page.locator("#ucapan-doa .ucapan-particle");
    await expect(particles).toHaveCount(6);
  });

  test("has left and right side decorations", async ({ page }) => {
    await expect(page.locator("#ucapan-doa .ucapan-side-left")).toBeAttached();
    await expect(page.locator("#ucapan-doa .ucapan-side-right")).toBeAttached();
  });

  test("has mountain silhouettes", async ({ page }) => {
    await expect(page.locator("#ucapan-doa .ucapan-mountain-back")).toBeAttached();
    await expect(page.locator("#ucapan-doa .ucapan-mountain-front")).toBeAttached();
  });

  test("has pine tree silhouettes on both sides", async ({ page }) => {
    await expect(page.locator("#ucapan-doa .ucapan-trees-left")).toBeAttached();
    await expect(page.locator("#ucapan-doa .ucapan-trees-right")).toBeAttached();
  });

  /* ── Content ────────────────────────────────────────────── */

  test("displays title with 'Ucapan & Doa' text", async ({ page }) => {
    const title = page.locator(".ucapan-title-text");
    await expect(title).toContainText("Ucapan & Doa");
  });

  test("title has decorative star characters", async ({ page }) => {
    const stars = page.locator(".ucapan-title-star");
    await expect(stars).toHaveCount(2);
  });

  test("displays subtitle from config", async ({ page }) => {
    await expect(page.locator(".ucapan-subtitle")).toContainText("Kirimkan ucapan");
  });

  test("displays body / description", async ({ page }) => {
    await expect(page.locator(".ucapan-body")).toContainText("Tulis pesanmu");
  });

  /* ── Form card ───────────────────────────────────────────── */

  test("glass card container exists", async ({ page }) => {
    await expect(page.locator(".ucapan-glass-border")).toBeAttached();
  });

  test("has 4 corner ornaments", async ({ page }) => {
    const corners = page.locator(".ucapan-corner");
    await expect(corners).toHaveCount(4);
  });

  /* ── Form fields ─────────────────────────────────────────── */

  test("name field exists with required attribute", async ({ page }) => {
    const nameInput = page.locator("#ucapan-name");
    await expect(nameInput).toBeAttached();
    await expect(nameInput).toHaveAttribute("required", "");
    await expect(nameInput).toHaveAttribute("placeholder", "Masukkan nama lengkap");
  });

  test("batch select exists with required attribute", async ({ page }) => {
    const batchSelect = page.locator("#ucapan-batch");
    await expect(batchSelect).toBeAttached();
    await expect(batchSelect).toHaveAttribute("required", "");
  });

  test("batch select has options from 1 to maxBatch", async ({ page }) => {
    const options = page.locator("#ucapan-batch option");
    const count = await options.count();
    // Should have 1 placeholder + maxBatch options
    const currentYear = new Date().getFullYear();
    const expectedMax = currentYear - 1978;
    expect(count).toBe(expectedMax + 1);
  });

  test("batch select allows selecting a valid option", async ({ page }) => {
    const batchSelect = page.locator("#ucapan-batch");
    await batchSelect.selectOption("25");
    await expect(batchSelect).toHaveValue("25");
  });

  test("message textarea exists with required attribute", async ({ page }) => {
    const textarea = page.locator("#ucapan-message");
    await expect(textarea).toBeAttached();
    await expect(textarea).toHaveAttribute("required", "");
    await expect(textarea).toHaveAttribute("placeholder", "Tulis ucapan, doa, atau kenangan terbaikmu untuk PALASMA...");
  });

  test("character count displays 0/500 initially", async ({ page }) => {
    await expect(page.locator("#ucapan-char-count")).toContainText("0/500");
  });

  /* ── Submit button ───────────────────────────────────────── */

  test("submit button exists with correct label", async ({ page }) => {
    const btn = page.locator("#ucapan-submit");
    await expect(btn).toBeAttached();
    await expect(btn).toHaveText("Kirim Ucapan");
    await expect(btn).toHaveClass(/ucapan-submit-btn/);
  });

  test("submit button has minimum touch target size", async ({ page }) => {
    const btn = page.locator("#ucapan-submit");
    const box = await btn.boundingBox();
    expect(box).not.toBeNull();
    expect(box.height).toBeGreaterThanOrEqual(56);
    expect(box.width).toBeGreaterThanOrEqual(200);
  });

  /* ── Gallery ─────────────────────────────────────────────── */

  test("gallery section exists", async ({ page }) => {
    await expect(page.locator("#ucapan-gallery")).toBeAttached();
  });

  test("gallery title exists", async ({ page }) => {
    await expect(page.locator(".ucapan-gallery-title")).toContainText("Ucapan dari Sahabat PALASMA");
  });

  test("empty state message is shown initially", async ({ page }) => {
    await expect(page.locator("#ucapan-gallery-empty")).toBeAttached();
  });

  /* ── Form validation ─────────────────────────────────────── */

  test("shows error when submitting empty form", async ({ page }) => {
    const formCard = page.locator(".ucapan-form-card");
    // Skip if form is hidden due to missing Supabase config
    const isVisible = await formCard.isVisible().catch(() => false);
    if (!isVisible) return;

    const btn = page.locator("#ucapan-submit");
    await btn.click();

    // Check that error messages appear
    await expect(page.locator("#ucapan-name-error")).toContainText("tidak boleh kosong");
    await expect(page.locator("#ucapan-batch-error")).toContainText("tidak boleh kosong");
    await expect(page.locator("#ucapan-message-error")).toContainText("tidak boleh kosong");
  });

  test("character count updates as user types", async ({ page }) => {
    const formCard = page.locator(".ucapan-form-card");
    const isVisible = await formCard.isVisible().catch(() => false);
    if (!isVisible) return;

    const textarea = page.locator("#ucapan-message");
    const charCount = page.locator("#ucapan-char-count");

    await textarea.fill("Hello");
    await expect(charCount).toContainText("5/500");

    await textarea.fill("a".repeat(100));
    await expect(charCount).toContainText("100/500");
  });

  /* ── Responsive ───────────────────────────────────────────── */

  test("form is usable on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.waitForSelector("#ucapan-doa");

    const formCard = page.locator(".ucapan-form-card");
    const isVisible = await formCard.isVisible().catch(() => false);
    if (!isVisible) return;

    const btn = page.locator("#ucapan-submit");
    const box = await btn.boundingBox();
    expect(box).not.toBeNull();
    expect(box.width).toBeGreaterThanOrEqual(200);
  });

  /* ── Accessibility ───────────────────────────────────────── */

  test("form fields have associated labels", async ({ page }) => {
    const nameLabel = page.locator("label[for='ucapan-name']");
    const batchLabel = page.locator("label[for='ucapan-batch']");
    const messageLabel = page.locator("label[for='ucapan-message']");

    await expect(nameLabel).toBeAttached();
    await expect(batchLabel).toBeAttached();
    await expect(messageLabel).toBeAttached();
  });

  test("required fields are marked with asterisk", async ({ page }) => {
    const requiredIndicators = page.locator(".ucapan-required");
    await expect(requiredIndicators).toHaveCount(3);
  });

  /* ── Noscript fallback ───────────────────────────────────── */

  test("noscript message element exists but is hidden when JS is enabled", async ({ page }) => {
    const noscript = page.locator(".ucapan-noscript");
    await expect(noscript).toBeAttached();
    // When JS is enabled, the noscript fallback should be hidden
    await expect(noscript).toBeHidden();
  });

  test("form and gallery are visible when Supabase is configured", async ({ page }) => {
    // In the default test env without Supabase, the unconfigured state is shown
    const unconfigured = page.locator("#ucapan-unconfigured");
    const formCard = page.locator(".ucapan-form-card");
    const gallerySection = page.locator(".ucapan-gallery-section");

    // Since Supabase is not configured in test env, unconfigured message is visible
    // and form/gallery are hidden
    const isUnconfiguredVisible = await unconfigured.isVisible().catch(() => false);
    if (isUnconfiguredVisible) {
      await expect(formCard).toBeHidden();
      await expect(gallerySection).toBeHidden();
    } else {
      await expect(formCard).toBeVisible();
      await expect(gallerySection).toBeVisible();
    }
  });

  /* ── Load More button ───────────────────────────────────── */

  test("load more button exists in the DOM", async ({ page }) => {
    const loadMoreBtn = page.locator("#ucapan-load-more");
    await expect(loadMoreBtn).toBeAttached();
  });

  test("load more wrapper exists in the DOM", async ({ page }) => {
    const loadMoreWrapper = page.locator("#ucapan-load-more-wrapper");
    await expect(loadMoreWrapper).toBeAttached();
  });

  test("no more messages element exists in the DOM", async ({ page }) => {
    const noMore = page.locator("#ucapan-no-more");
    await expect(noMore).toBeAttached();
  });

  /* ── Supabase unconfigured state ────────────────────────── */

  test("unconfigured state element exists in the DOM", async ({ page }) => {
    const unconfigured = page.locator("#ucapan-unconfigured");
    await expect(unconfigured).toBeAttached();
  });

  /* ── Batch select validation ────────────────────────────── */

  test("batch select has a disabled placeholder as first option", async ({ page }) => {
    const firstOption = page.locator("#ucapan-batch option").first();
    await expect(firstOption).toHaveAttribute("disabled", "");
    await expect(firstOption).toHaveText(/Pilih|Angkatan|Contoh/i);
  });
});
