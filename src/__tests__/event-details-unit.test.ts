import { describe, it, expect } from "vitest";
import { calculateCountdown, formatCountdownValue } from "@utils/event-details";

describe("formatCountdownValue()", () => {
  it("pads single digit with leading zero", () => {
    expect(formatCountdownValue(5)).toBe("05");
  });

  it("keeps double digit as-is", () => {
    expect(formatCountdownValue(12)).toBe("12");
  });

  it("handles zero", () => {
    expect(formatCountdownValue(0)).toBe("00");
  });

  it("handles large numbers", () => {
    expect(formatCountdownValue(365)).toBe("365");
  });
});

describe("calculateCountdown()", () => {
  it("returns correct values for a future date (1 day away)", () => {
    const now = new Date("2026-06-05T12:00:00Z");
    const target = new Date("2026-06-06T12:00:00Z");
    const result = calculateCountdown(target, now);
    expect(result.days).toBe(1);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
    expect(result.isOver).toBe(false);
  });

  it("returns correct values for a future date (some hours away)", () => {
    const now = new Date("2026-06-05T00:00:00Z");
    const target = new Date("2026-06-06T12:30:45Z");
    const result = calculateCountdown(target, now);
    expect(result.days).toBe(1);
    expect(result.hours).toBe(12);
    expect(result.minutes).toBe(30);
    expect(result.seconds).toBe(45);
    expect(result.isOver).toBe(false);
  });

  it("returns isOver=true for a past date", () => {
    const now = new Date("2026-06-10T12:00:00Z");
    const target = new Date("2026-06-05T12:00:00Z");
    const result = calculateCountdown(target, now);
    expect(result.days).toBe(0);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
    expect(result.isOver).toBe(true);
  });

  it("returns isOver=true when now equals target", () => {
    const now = new Date("2026-06-05T12:00:00Z");
    const target = new Date("2026-06-05T12:00:00Z");
    const result = calculateCountdown(target, now);
    expect(result.isOver).toBe(true);
  });

  it("handles boundary case of exactly 1 hour", () => {
    const now = new Date("2026-06-05T10:00:00Z");
    const target = new Date("2026-06-05T11:00:00Z");
    const result = calculateCountdown(target, now);
    expect(result.days).toBe(0);
    expect(result.hours).toBe(1);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
    expect(result.isOver).toBe(false);
  });

  it("handles boundary case of exactly 1 minute", () => {
    const now = new Date("2026-06-05T10:00:00Z");
    const target = new Date("2026-06-05T10:01:00Z");
    const result = calculateCountdown(target, now);
    expect(result.days).toBe(0);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(1);
    expect(result.seconds).toBe(0);
    expect(result.isOver).toBe(false);
  });
});
