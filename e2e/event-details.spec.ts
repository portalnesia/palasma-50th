import { test, expect } from "@playwright/test";

test.describe("Event Details Section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("#splash");
    await page.click("#splash-cta");
    await page.waitForTimeout(1500);
  });

  test("section exists with correct id and class", async ({ page }) => {
    const section = page.locator("#event-details");
    await expect(section).toBeAttached();
    await expect(section).toHaveClass(/event-section/);
  });

  test("displays title", async ({ page }) => {
    await expect(page.locator(".event-title")).toContainText("Info Acara");
  });

  test("title has decorative stars", async ({ page }) => {
    const stars = page.locator(".event-title-star");
    await expect(stars).toHaveCount(2);
  });

  test("countdown elements exist with correct data-unit", async ({ page }) => {
    await expect(page.locator('[data-unit="days"]')).toBeAttached();
    await expect(page.locator('[data-unit="hours"]')).toBeAttached();
    await expect(page.locator('[data-unit="minutes"]')).toBeAttached();
    await expect(page.locator('[data-unit="seconds"]')).toBeAttached();
  });

  test("countdown values are numeric", async ({ page }) => {
    const days = page.locator("#countdown-days");
    const hours = page.locator("#countdown-hours");
    const minutes = page.locator("#countdown-minutes");
    const seconds = page.locator("#countdown-seconds");
    await expect(days).toContainText(/^\d{2}$/);
    await expect(hours).toContainText(/^\d{2}$/);
    await expect(minutes).toContainText(/^\d{2}$/);
    await expect(seconds).toContainText(/^\d{2}$/);
  });

  test("displays event name from config", async ({ page }) => {
    await expect(page.locator(".event-info-card")).toContainText("HUT ke-50 PALASMA");
  });

  test("displays date label from config", async ({ page }) => {
    await expect(page.locator(".event-info-card")).toContainText("29–30 Agustus 2026");
  });

  test("displays time from config", async ({ page }) => {
    await expect(page.locator(".event-info-card")).toContainText("16.00 WITA");
  });

  test("displays location from config", async ({ page }) => {
    await expect(page.locator(".event-info-card")).toContainText("Aranka Tempasan");
  });

  test("info card has 4 info rows", async ({ page }) => {
    const rows = page.locator(".event-info-row");
    await expect(rows).toHaveCount(4);
  });

  test("info rows have icons", async ({ page }) => {
    const icons = page.locator(".event-info-icon");
    await expect(icons).toHaveCount(4);
  });

  test("info card has dividers between rows", async ({ page }) => {
    const dividers = page.locator(".event-info-divider");
    await expect(dividers).toHaveCount(3);
  });

  test("maps iframe is present with correct src", async ({ page }) => {
    const iframe = page.locator(".event-maps-embed");
    await expect(iframe).toBeAttached();
    await expect(iframe).toHaveAttribute("src", /google\.com\/maps\/embed/);
  });

  test("maps iframe has accessibility attributes", async ({ page }) => {
    const iframe = page.locator(".event-maps-embed");
    await expect(iframe).toHaveAttribute("title", "Lokasi Acara — Aranka Tempasan");
    await expect(iframe).toHaveAttribute("loading", "lazy");
  });

  test("ornamental flourishes exist", async ({ page }) => {
    await expect(page.locator(".event-ornament-top")).toBeAttached();
    await expect(page.locator(".event-ornament-bottom")).toBeAttached();
    await expect(page.locator(".event-flourish")).toHaveCount(2);
  });

  test("floating particles are present", async ({ page }) => {
    const particles = page.locator(".event-particle");
    const count = await particles.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test("glass card with corner ornaments exist", async ({ page }) => {
    await expect(page.locator(".event-info-card")).toBeAttached();
    await expect(page.locator(".event-corner-tl")).toBeAttached();
    await expect(page.locator(".event-corner-br")).toBeAttached();
  });
});
