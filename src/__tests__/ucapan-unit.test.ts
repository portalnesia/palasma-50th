import { describe, it, expect } from "vitest";
import {
  validateForm,
  hasErrors,
  formatMessageDate,
  truncateMessage,
} from "@utils/ucapan";

// Compute dynamic maxBatch to match validation logic
const PALASMA_BASE_YEAR = 1978;
const maxBatch = new Date().getFullYear() - PALASMA_BASE_YEAR;

/* ── validateForm ─────────────────────────────────────────── */

describe("validateForm()", () => {
  it("returns no errors for valid input", () => {
    const errors = validateForm("Budi Santoso", "25", "Semoga PALASMA jaya!");
    expect(errors).toEqual({});
  });

  it("requires name", () => {
    const errors = validateForm("", "25", "Pesan");
    expect(errors.name).toBeDefined();
    expect(errors.name).toContain("kosong");
  });

  it("requires name with whitespace only", () => {
    const errors = validateForm("   ", "25", "Pesan");
    expect(errors.name).toBeDefined();
  });

  it("requires batch_year", () => {
    const errors = validateForm("Budi", "", "Pesan");
    expect(errors.batch_year).toBeDefined();
    expect(errors.batch_year).toContain("kosong");
  });

  it("rejects batch_year out of range", () => {
    const errors = validateForm("Budi", "0", "Pesan");
    expect(errors.batch_year).toBeDefined();
    expect(errors.batch_year).toContain("1 dan");
    const errors2 = validateForm("Budi", String(maxBatch + 1), "Pesan");
    expect(errors2.batch_year).toBeDefined();
    expect(errors2.batch_year).toContain("1 dan");
  });

  it("accepts batch_year at boundary values", () => {
    const errors1 = validateForm("Budi", "1", "Pesan");
    expect(errors1.batch_year).toBeUndefined();
    const errorsMax = validateForm("Budi", String(maxBatch), "Pesan");
    expect(errorsMax.batch_year).toBeUndefined();
  });

  it("requires message", () => {
    const errors = validateForm("Budi", "25", "");
    expect(errors.message).toBeDefined();
    expect(errors.message).toContain("kosong");
  });

  it("requires message with whitespace only", () => {
    const errors = validateForm("Budi", "25", "   ");
    expect(errors.message).toBeDefined();
  });

  it("rejects message exceeding 500 characters", () => {
    const longMessage = "a".repeat(501);
    const errors = validateForm("Budi", "25", longMessage);
    expect(errors.message).toBeDefined();
    expect(errors.message).toContain("500");
  });

  it("accepts message at exactly 500 characters", () => {
    const exactMessage = "a".repeat(500);
    const errors = validateForm("Budi", "25", exactMessage);
    expect(errors.message).toBeUndefined();
  });

  it("rejects name exceeding 100 characters", () => {
    const longName = "a".repeat(101);
    const errors = validateForm(longName, "25", "Pesan");
    expect(errors.name).toBeDefined();
    expect(errors.name).toContain("100");
  });

  it("accepts name at exactly 100 characters", () => {
    const exactName = "a".repeat(100);
    const errors = validateForm(exactName, "25", "Pesan");
    expect(errors.name).toBeUndefined();
  });

  it("returns multiple errors when all fields are empty", () => {
    const errors = validateForm("", "", "");
    expect(errors.name).toBeDefined();
    expect(errors.batch_year).toBeDefined();
    expect(errors.message).toBeDefined();
  });

  it("only returns errors for empty fields", () => {
    const errors = validateForm("Budi", "", "Pesan");
    expect(errors.name).toBeUndefined();
    expect(errors.batch_year).toBeDefined();
    expect(errors.message).toBeUndefined();
  });
});

/* ── hasErrors ────────────────────────────────────────────── */

describe("hasErrors()", () => {
  it("returns false for empty errors object", () => {
    expect(hasErrors({})).toBe(false);
  });

  it("returns true when name error exists", () => {
    expect(hasErrors({ name: "Required" })).toBe(true);
  });

  it("returns true when multiple errors exist", () => {
    expect(
      hasErrors({ name: "Required", message: "Required" }),
    ).toBe(true);
  });
});

/* ── formatMessageDate ────────────────────────────────────── */

describe("formatMessageDate()", () => {
  it("formats ISO date to Indonesian locale string", () => {
    const result = formatMessageDate("2026-06-15T10:30:00Z");
    // Should contain year 2026
    expect(result).toContain("2026");
    // Should contain time (Indonesian locale uses dot separator: HH.MM)
    expect(result).toMatch(/\d{2}\.\d{2}/);
  });

  it("handles different date strings", () => {
    const result = formatMessageDate("2025-01-01T00:00:00Z");
    expect(result).toContain("2025");
  });

  it("returns a non-empty string", () => {
    const result = formatMessageDate("2026-06-15T10:30:00Z");
    expect(result.length).toBeGreaterThan(0);
  });
});

/* ── truncateMessage ──────────────────────────────────────── */

describe("truncateMessage()", () => {
  it("returns original message if within limit", () => {
    const msg = "Hello world";
    expect(truncateMessage(msg)).toBe("Hello world");
  });

  it("truncates message exceeding default 120 chars", () => {
    const msg = "a".repeat(150);
    const result = truncateMessage(msg);
    expect(result.length).toBeLessThan(150);
    expect(result).toContain("...");
  });

  it("truncates with custom maxLength", () => {
    const msg = "This is a long message";
    const result = truncateMessage(msg, 10);
    expect(result.length).toBeLessThanOrEqual(13); // 10 + "..."
    expect(result).toContain("...");
  });

  it("returns original message at exact limit", () => {
    const msg = "a".repeat(120);
    expect(truncateMessage(msg)).toBe(msg);
  });

  it("handles empty string", () => {
    expect(truncateMessage("")).toBe("");
  });

  it("handles single character", () => {
    expect(truncateMessage("a")).toBe("a");
  });
});
