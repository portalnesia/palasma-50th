import { test, expect } from "@playwright/test";

/* ── Helpers ────────────────────────────────────────────────── */

/** Wait for JS to finish the isConfigured() check */
async function waitForJSReady(page: import("@playwright/test").Page) {
  await page.waitForFunction(
    () => {
      const section = document.getElementById("ucapan-doa");
      if (!section) return false;
      const unconfigured = section.querySelector<HTMLElement>("#ucapan-unconfigured");
      const dialog = document.getElementById("ucapan-dialog") as HTMLDialogElement | null;
      return (unconfigured && !unconfigured.hidden) || (dialog && !dialog.hidden);
    },
    { timeout: 5000 },
  );
}

/** Detect whether Supabase is configured at runtime */
async function isSupabaseConfigured(page: import("@playwright/test").Page): Promise<boolean> {
  const result = await page.evaluate(() => {
    const dialog = document.getElementById("ucapan-dialog") as HTMLDialogElement | null;
    return dialog !== null && !dialog.hidden;
  });
  return result;
}

/** Open the ucapan dialog */
async function openUcapanDialog(page: import("@playwright/test").Page) {
  await page.click("#ucapan-open-form-btn");
  await page.waitForSelector("#ucapan-dialog[open]");
}

/* ── Structure — always runs, no env dependency ─────────────── */

test.describe("Ucapan & Doa — Structure", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#ucapan-doa");
  });

  test("section exists with correct id and class", async ({ page }) => {
    const section = page.locator("#ucapan-doa");
    await expect(section).toBeAttached();
    await expect(section).toHaveClass(/ucapan-section/);
  });

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

  test("has floating gold particles", async ({ page }) => {
    const particles = page.locator("#ucapan-doa .ucapan-particle");
    await expect(particles).toHaveCount(8);
  });

  test("has left and right side decorations", async ({ page }) => {
    await expect(page.locator("#ucapan-doa .event-side-left")).toBeAttached();
    await expect(page.locator("#ucapan-doa .event-side-right")).toBeAttached();
  });

  test("has mountain silhouettes", async ({ page }) => {
    await expect(page.locator("#ucapan-doa .ucapan-mountain-back")).toBeAttached();
    await expect(page.locator("#ucapan-doa .ucapan-mountain-front")).toBeAttached();
  });

  test("has pine tree silhouettes on both sides", async ({ page }) => {
    await expect(page.locator("#ucapan-doa .ucapan-trees-left")).toBeAttached();
    await expect(page.locator("#ucapan-doa .ucapan-trees-right")).toBeAttached();
  });

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

  test("glass card container exists", async ({ page }) => {
    await expect(page.locator(".ucapan-glass-border")).toBeAttached();
  });

  test("has 4 corner ornaments", async ({ page }) => {
    const corners = page.locator(".ucapan-corner");
    await expect(corners).toHaveCount(4);
  });

  test("noscript message element exists but is hidden when JS is enabled", async ({ page }) => {
    const noscript = page.locator(".ucapan-noscript");
    await expect(noscript).toBeAttached();
    await expect(noscript).toBeHidden();
  });

  test("unconfigured state element exists in the DOM", async ({ page }) => {
    await expect(page.locator("#ucapan-unconfigured")).toBeAttached();
  });

  test("no more messages element exists in the DOM", async ({ page }) => {
    await expect(page.locator("#ucapan-no-more")).toBeAttached();
  });
});

/* ── Dynamic: form visibility adapts to Supabase config ─────── */

test.describe("Ucapan & Doa — Config-aware", () => {
  test("form and gallery visibility matches Supabase config", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#ucapan-doa");
    await waitForJSReady(page);

    const configured = await isSupabaseConfigured(page);

    if (configured) {
      await expect(page.locator("#ucapan-dialog")).toBeAttached();
      await expect(page.locator(".ucapan-gallery-section")).toBeVisible();
      await expect(page.locator("#ucapan-unconfigured")).toBeHidden();
    } else {
      await expect(page.locator("#ucapan-dialog")).toBeHidden();
      await expect(page.locator(".ucapan-gallery-section")).toBeHidden();
      await expect(page.locator("#ucapan-unconfigured")).toBeVisible();
    }
  });

  test("form fields are functional when Supabase is configured", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#ucapan-doa");
    await waitForJSReady(page);

    const configured = await isSupabaseConfigured(page);
    if (!configured) return;

    await openUcapanDialog(page);

    // Name field
    const nameInput = page.locator("#ucapan-name");
    await expect(nameInput).toHaveAttribute("required", "");
    await expect(nameInput).toHaveAttribute("placeholder", "Masukkan nama lengkap");

    // Batch select (not required — conditional with organization)
    const batchSelect = page.locator("#ucapan-batch");
    const options = page.locator("#ucapan-batch option");
    const count = await options.count();
    const expectedMax = new Date().getFullYear() - 1978;
    expect(count).toBe(expectedMax + 1);

    // Message textarea
    const textarea = page.locator("#ucapan-message");
    await expect(textarea).toHaveAttribute("required", "");
    await expect(textarea).toHaveAttribute(
      "placeholder",
      "Tulis ucapan, doa, atau kenangan terbaikmu untuk PALASMA...",
    );

    // Character count
    await expect(page.locator("#ucapan-char-count")).toContainText("0/500");
  });

  test("batch select has a disabled placeholder as first option", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#ucapan-doa");
    await waitForJSReady(page);

    const configured = await isSupabaseConfigured(page);
    if (!configured) return;

    await openUcapanDialog(page);

    const firstOption = page.locator("#ucapan-batch option").first();
    await expect(firstOption).toHaveAttribute("disabled", "");
    await expect(firstOption).toHaveText(/Pilih|Angkatan|Contoh/i);
  });

  test("batch select allows selecting a valid option", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#ucapan-doa");
    await waitForJSReady(page);

    const configured = await isSupabaseConfigured(page);
    if (!configured) return;

    await openUcapanDialog(page);

    const batchSelect = page.locator("#ucapan-batch");
    await batchSelect.selectOption("25");
    await expect(batchSelect).toHaveValue("25");
  });

  test("character count updates as user types", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#ucapan-doa");
    await waitForJSReady(page);

    const configured = await isSupabaseConfigured(page);
    if (!configured) return;

    await openUcapanDialog(page);

    const textarea = page.locator("#ucapan-message");
    const charCount = page.locator("#ucapan-char-count");

    await textarea.fill("Hello");
    await expect(charCount).toContainText("5/500");

    await textarea.fill("a".repeat(100));
    await expect(charCount).toContainText("100/500");
  });

  test("submit button exists with correct label and size", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#ucapan-doa");
    await waitForJSReady(page);

    const configured = await isSupabaseConfigured(page);
    if (!configured) return;

    await openUcapanDialog(page);

    const btn = page.locator("#ucapan-submit");
    await expect(btn).toContainText("Kirim Ucapan");
    await expect(btn).toHaveClass(/ucapan-submit-btn/);

    const box = await btn.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(48);
    expect(box!.width).toBeGreaterThanOrEqual(200);
  });

  test("shows validation errors when submitting empty form", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#ucapan-doa");
    await waitForJSReady(page);

    const configured = await isSupabaseConfigured(page);
    if (!configured) return;

    await openUcapanDialog(page);

    const btn = page.locator("#ucapan-submit");
    await btn.click();

    await expect(page.locator("#ucapan-name-error")).toContainText("tidak boleh kosong");
    await expect(page.locator("#ucapan-batch-error")).toContainText("harus diisi salah satu");
    await expect(page.locator("#ucapan-message-error")).toContainText("tidak boleh kosong");
  });

  test("form fields have associated labels", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#ucapan-doa");
    await waitForJSReady(page);

    const configured = await isSupabaseConfigured(page);
    if (!configured) return;

    await expect(page.locator("label[for='ucapan-name']")).toBeAttached();
    await expect(page.locator("label[for='ucapan-batch']")).toBeAttached();
    await expect(page.locator("label[for='ucapan-message']")).toBeAttached();
  });

  test("required fields are marked with asterisk", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#ucapan-doa");
    await waitForJSReady(page);

    const configured = await isSupabaseConfigured(page);
    if (!configured) return;

    const requiredIndicators = page.locator(".ucapan-required");
    await expect(requiredIndicators).toHaveCount(2);
  });

  test("gallery section exists with title when configured", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#ucapan-doa");
    await waitForJSReady(page);

    const configured = await isSupabaseConfigured(page);
    if (!configured) return;

    await expect(page.locator("#ucapan-gallery")).toBeAttached();
    await expect(page.locator(".ucapan-gallery-title")).toContainText(
      "Ucapan dari Sahabat PALASMA",
    );
  });

  test("empty state message is shown initially when no messages", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#ucapan-doa");
    await waitForJSReady(page);

    const configured = await isSupabaseConfigured(page);
    if (!configured) return;

    const emptyState = page.locator("#ucapan-gallery-empty");
    const cards = page.locator("#ucapan-gallery .ucapan-item");
    const cardCount = await cards.count();
    if (cardCount === 0) {
      await expect(emptyState).toBeAttached();
    }
  });

  test("form is usable on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.waitForSelector("#ucapan-doa");
    await waitForJSReady(page);

    const configured = await isSupabaseConfigured(page);
    if (!configured) return;

    await openUcapanDialog(page);

    const btn = page.locator("#ucapan-submit");
    const box = await btn.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(200);
  });
});
