import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  validateImageFile,
  formatDateFilename,
  triggerDownload,
  setupTwibbon,
} from "@utils/twibbon";

/* ── validateImageFile ────────────────────────────────────── */

describe("validateImageFile()", () => {
  function makeFile(name: string, type: string, size: number): File {
    const buffer = new ArrayBuffer(size);
    return new File([buffer], name, { type });
  }

  it("accepts JPEG image", () => {
    const file = makeFile("photo.jpg", "image/jpeg", 1024 * 100);
    expect(validateImageFile(file)).toEqual({ valid: true });
  });

  it("accepts PNG image", () => {
    const file = makeFile("photo.png", "image/png", 1024 * 100);
    expect(validateImageFile(file)).toEqual({ valid: true });
  });

  it("accepts WebP image", () => {
    const file = makeFile("photo.webp", "image/webp", 1024 * 100);
    expect(validateImageFile(file)).toEqual({ valid: true });
  });

  it("accepts GIF image", () => {
    const file = makeFile("photo.gif", "image/gif", 1024 * 100);
    expect(validateImageFile(file)).toEqual({ valid: true });
  });

  it("rejects SVG image", () => {
    const file = makeFile("icon.svg", "image/svg+xml", 1024);
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toContain("tidak didukung");
    }
  });

  it("rejects PDF file", () => {
    const file = makeFile("doc.pdf", "application/pdf", 1024);
    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
  });

  it("rejects file exceeding max size", () => {
    const file = makeFile("big.jpg", "image/jpeg", 6 * 1024 * 1024);
    const result = validateImageFile(file, 5 * 1024 * 1024);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toContain("terlalu besar");
    }
  });

  it("accepts file at exact max size", () => {
    const file = makeFile("exact.jpg", "image/jpeg", 5 * 1024 * 1024);
    expect(validateImageFile(file, 5 * 1024 * 1024)).toEqual({ valid: true });
  });
});

/* ── triggerDownload ──────────────────────────────────────── */

describe("triggerDownload()", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("creates and clicks a download link", () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click");

    const a = triggerDownload("data:text/plain,hello", "test.txt");
    expect(a).toBeInstanceOf(HTMLAnchorElement);
    expect(a.download).toBe("test.txt");
    expect(clickSpy).toHaveBeenCalled();

    clickSpy.mockRestore();
  });

  it("appends the anchor to document body", () => {
    const a = triggerDownload("data:text/plain,hello", "test.txt");
    // Should be in body initially
    expect(document.body.contains(a)).toBe(true);
  });
});

/* ── formatDateFilename ───────────────────────────────────── */

describe("formatDateFilename()", () => {
  it("formats date as YYYY-MM-DD", () => {
    const date = new Date(2026, 7, 29); // August 29, 2026
    expect(formatDateFilename(date)).toBe("2026-08-29");
  });

  it("pads single-digit months", () => {
    const date = new Date(2026, 0, 15); // January 15, 2026
    expect(formatDateFilename(date)).toBe("2026-01-15");
  });

  it("pads single-digit days", () => {
    const date = new Date(2026, 11, 5); // December 5, 2026
    expect(formatDateFilename(date)).toBe("2026-12-05");
  });

  it("uses today when no argument provided", () => {
    const result = formatDateFilename();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

/* ── setupTwibbon ─────────────────────────────────────────── */

describe("setupTwibbon()", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section id="twibbon">
        <input type="file" id="twibbon-file-input" accept="image/*" />
        <div id="twibbon-preview"></div>
        <div id="twibbon-croppie"></div>
        <div id="twibbon-controls" style="display:none"></div>
        <button id="twibbon-btn-download" type="button">Download</button>
        <button id="twibbon-btn-reset" type="button">Ulangi</button>
        <p id="twibbon-status" class="twibbon-status--hidden"></p>
        <label id="twibbon-upload-label" for="twibbon-file-input">Pilih Foto</label>
      </section>
    `;
  });

  it("returns a cleanup function", () => {
    const section = document.getElementById("twibbon")!;
    const cleanup = setupTwibbon(section);
    expect(typeof cleanup).toBe("function");
    cleanup();
  });

  it("does not throw when elements exist", () => {
    const section = document.getElementById("twibbon")!;
    expect(() => setupTwibbon(section)).not.toThrow();
  });

  it("does not throw on minimal DOM", () => {
    document.body.innerHTML = `<section id="twibbon"><div></div></section>`;
    const section = document.getElementById("twibbon")!;
    const cleanup = setupTwibbon(section);
    expect(() => cleanup()).not.toThrow();
  });
});
