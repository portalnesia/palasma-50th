import { test, expect } from "@playwright/test";

test.describe("Absensi Section", () => {
  test("section renders with title, text, and link", async ({ page }) => {
    await page.goto("/");

    // Check main section
    const section = page.locator("#absensi");
    await expect(section).toBeAttached();

    // Check title
    await expect(page.locator(".absensi-title")).toContainText("Pendataan & Absensi");

    // Check subtitle
    await expect(page.locator(".absensi-subtitle")).toContainText("Reuni Akbar 50 Tahun PALASMA");

    // Check main CTA button href
    const link = page.locator("#absensi-form-link");
    await expect(link).toBeAttached();
    await expect(link).toHaveAttribute("href", /google\.com\/forms\/d\/e\/.+\/viewform/);
  });

  test("pre-fills guest name if 'to' query parameter is present", async ({ page }) => {
    await page.goto("/?to=Budi+Santoso");

    const link = page.locator("#absensi-form-link");
    await expect(link).toBeAttached();

    const href = await link.getAttribute("href");
    expect(href).toContain("entry.716340845=Budi+Santoso");
  });

  test("floating CTA visibility toggles on scroll", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#absensi");

    // Dismiss splash screen so the page can scroll
    const splashBtn = page.locator("#splash-scroll-btn");
    await splashBtn.click();
    await page.waitForTimeout(1500);

    // By default, the floating CTA should be hidden/transparent when at the top of the page
    const floatingCta = page.locator("#absensi-floating-cta");
    await expect(floatingCta).toBeAttached();

    // It should have opacity 0 initially (or very low/hidden)
    const initialOpacity = await floatingCta.evaluate((el) => window.getComputedStyle(el).opacity);
    expect(Number(initialOpacity)).toBe(0);

    // Scroll down to bring the absensi section into view
    await page.locator("#absensi").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    // Now it should be visible (opacity close to 1)
    const scrolledOpacity = await floatingCta.evaluate((el) => window.getComputedStyle(el).opacity);
    expect(Number(scrolledOpacity)).toBeGreaterThan(0.5);

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1500);

    // It should stay visible forever once unlocked
    const finalOpacity = await floatingCta.evaluate((el) => window.getComputedStyle(el).opacity);
    expect(Number(finalOpacity)).toBeGreaterThan(0.5);
  });

  test("clicking floating CTA scrolls viewport to absensi section", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#absensi");

    // Dismiss splash screen so the page can scroll
    const splashBtn = page.locator("#splash-scroll-btn");
    await splashBtn.click();
    await page.waitForTimeout(1500);

    const section = page.locator("#absensi");
    const floatingCta = page.locator("#absensi-floating-cta");

    // Scroll down to activate the floating CTA
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    // Click the floating button
    await floatingCta.click({ force: true });
    await page.waitForTimeout(2000); // wait for smooth scroll to finish

    // Verify that the viewport is scrolled near the #absensi section
    const dimensions = await section.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return {
        top: rect.top,
        bottom: rect.bottom,
        windowHeight: window.innerHeight,
        scrollY: window.scrollY,
      };
    });

    // We expect the top of the section to be near the top of the viewport (within 150px)
    expect(Math.abs(dimensions.top)).toBeLessThan(150);
  });
});
