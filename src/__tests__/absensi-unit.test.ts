import { describe, it, expect, beforeEach } from "vitest";
import { buildGoogleFormUrl, setupAbsensiSection } from "@utils/absensi";

describe("buildGoogleFormUrl()", () => {
  it("returns base URL if no name is provided", () => {
    const base =
      "https://docs.google.com/forms/d/e/1FAIpQLSdvL6io5FWs7Wh5cUxZu4NDNEZEgvM5dOJv9Xlls8EIAbIBKg/viewform";
    expect(buildGoogleFormUrl(base)).toBe(base);
    expect(buildGoogleFormUrl(base, null)).toBe(base);
    expect(buildGoogleFormUrl(base, "")).toBe(base);
  });

  it("appends name parameter if name is provided", () => {
    const base =
      "https://docs.google.com/forms/d/e/1FAIpQLSdvL6io5FWs7Wh5cUxZu4NDNEZEgvM5dOJv9Xlls8EIAbIBKg/viewform";
    const name = "Abang Ganteng";
    const result = buildGoogleFormUrl(base, name);
    expect(result).toContain("entry.716340845=Abang+Ganteng");
  });

  it("handles valid URL parsing and search parameter setting", () => {
    const base = "https://example.com/form";
    const result = buildGoogleFormUrl(base, "Test");
    expect(result).toBe("https://example.com/form?usp=pp_url&entry.716340845=Test");
  });

  it("handles fallback parsing if URL is short/invalid", () => {
    const base = "invalid-url-but-string";
    const result = buildGoogleFormUrl(base, "Test");
    expect(result).toBe("invalid-url-but-string?entry.716340845=Test");
  });
});

describe("setupAbsensiSection()", () => {
  let section: HTMLElement;
  let floatingBtn: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <section id="absensi">
        <div data-reveal="absensi-decor"></div>
        <h2 data-reveal="absensi-title">Title</h2>
        <div data-reveal="absensi-body"></div>
        <div data-reveal="absensi-btn"></div>
      </section>
      <button id="absensi-floating-cta"></button>
    `;
    section = document.getElementById("absensi")!;
    floatingBtn = document.getElementById("absensi-floating-cta")!;
  });

  it("returns a cleanup function", () => {
    const cleanup = setupAbsensiSection(section, floatingBtn);
    expect(typeof cleanup).toBe("function");
    cleanup();
  });

  it("does not throw when initialized", () => {
    expect(() => {
      const cleanup = setupAbsensiSection(section, floatingBtn);
      cleanup();
    }).not.toThrow();
  });
});
