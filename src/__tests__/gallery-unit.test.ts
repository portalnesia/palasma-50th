import { describe, it, expect } from "vitest";
import { ASSETS } from "@config/assets.ts";
import { getNextIndex, getPrevIndex, getSwipeDirection } from "@utils/gallery.ts";

describe("Gallery Configuration", () => {
  it("should have a gallery array in ASSETS", () => {
    expect(ASSETS.gallery).toBeDefined();
    expect(Array.isArray(ASSETS.gallery)).toBe(true);
    expect(ASSETS.gallery.length).toBeGreaterThan(0);
  });

  it("should contain items with src and caption properties", () => {
    ASSETS.gallery.forEach((item) => {
      expect(item).toHaveProperty("src");
      expect(typeof item.src).toBe("string");
      expect(item.src).not.toBe("");

      expect(item).toHaveProperty("caption");
      expect(typeof item.caption).toBe("string");
    });
  });

  it("should have exactly two items with non-empty captions", () => {
    const withCaptions = ASSETS.gallery.filter(
      (item) => item.caption && item.caption.trim() !== "",
    );
    expect(withCaptions.length).toBe(2);
  });
});

describe("Gallery Utility Functions", () => {
  describe("getNextIndex()", () => {
    it("should return correct next index in normal range", () => {
      expect(getNextIndex(0, 3)).toBe(1);
      expect(getNextIndex(1, 3)).toBe(2);
    });

    it("should wrap around to 0 when index is at the end", () => {
      expect(getNextIndex(2, 3)).toBe(0);
    });

    it("should return 0 if totalItems is 0 or negative", () => {
      expect(getNextIndex(1, 0)).toBe(0);
      expect(getNextIndex(1, -5)).toBe(0);
    });
  });

  describe("getPrevIndex()", () => {
    it("should return correct previous index in normal range", () => {
      expect(getPrevIndex(2, 3)).toBe(1);
      expect(getPrevIndex(1, 3)).toBe(0);
    });

    it("should wrap around to end when index is 0", () => {
      expect(getPrevIndex(0, 3)).toBe(2);
    });

    it("should return 0 if totalItems is 0 or negative", () => {
      expect(getPrevIndex(1, 0)).toBe(0);
      expect(getPrevIndex(1, -5)).toBe(0);
    });
  });

  describe("getSwipeDirection()", () => {
    it("should return 'prev' for left-to-right swipe", () => {
      expect(getSwipeDirection(100, 200, 50)).toBe("prev");
    });

    it("should return 'next' for right-to-left swipe", () => {
      expect(getSwipeDirection(200, 100, 50)).toBe("next");
    });

    it("should return null if distance is below threshold", () => {
      expect(getSwipeDirection(100, 140, 50)).toBeNull();
      expect(getSwipeDirection(100, 60, 50)).toBeNull();
    });
  });
});
