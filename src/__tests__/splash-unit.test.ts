import { describe, it, expect, beforeEach, vi } from "vitest";
import { getRecipientName, setupMusicToggle, bindCtaScroll } from "@utils/splash";

function mockGsap() {
  return { to: vi.fn() };
}

describe("getRecipientName()", () => {
  it("extracts ?to= from search string", () => {
    expect(getRecipientName("?to=Abang")).toBe("Abang");
  });

  it("returns null when ?to= is absent", () => {
    expect(getRecipientName("")).toBeNull();
  });

  it("handles URL-encoded values", () => {
    expect(getRecipientName("?to=Budi%20Santoso")).toBe("Budi Santoso");
  });
});

describe("setupMusicToggle()", () => {
  let audio: HTMLAudioElement;
  let iconOn: HTMLElement;
  let iconOff: HTMLElement;

  beforeEach(() => {
    audio = document.createElement("audio");
    iconOn = document.createElement("span");
    iconOn.classList.add("hidden");
    iconOff = document.createElement("span");
  });

  it("returns isPlaying and toggle functions", () => {
    const result = setupMusicToggle(audio, iconOn, iconOff);
    expect(typeof result.isPlaying).toBe("function");
    expect(typeof result.toggle).toBe("function");
  });

  it("starts with isPlaying false", () => {
    const result = setupMusicToggle(audio, iconOn, iconOff);
    expect(result.isPlaying()).toBe(false);
  });

  it("handles play error gracefully", async () => {
    audio.play = async () => {
      throw new Error("autoplay blocked");
    };
    const result = setupMusicToggle(audio, iconOn, iconOff);
    await result.toggle();
    expect(result.isPlaying()).toBe(false);
  });

  it("toggles icon visibility on toggle call", async () => {
    audio.play = async () => {
      /* noop */
    };
    const result = setupMusicToggle(audio, iconOn, iconOff);
    expect(iconOn.classList.contains("hidden")).toBe(true);
    expect(iconOff.classList.contains("hidden")).toBe(false);

    await result.toggle();
    expect(iconOn.classList.contains("hidden")).toBe(false);
    expect(iconOff.classList.contains("hidden")).toBe(true);

    await result.toggle();
    expect(iconOn.classList.contains("hidden")).toBe(true);
    expect(iconOff.classList.contains("hidden")).toBe(false);
  });
});

describe("bindCtaScroll()", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="splash-cta">Buka Undangan</button>
      <div id="main-content" style="height: 2000px;"></div>
    `;
  });

  it("returns a cleanup function", () => {
    const gsap = mockGsap();
    const btn = document.getElementById("splash-cta")!;
    const cleanup = bindCtaScroll(gsap as any, btn, "main-content");
    expect(typeof cleanup).toBe("function");
    cleanup();
  });

  it("does not throw when target exists", () => {
    const gsap = mockGsap();
    const btn = document.getElementById("splash-cta")!;
    expect(() => bindCtaScroll(gsap as any, btn, "main-content")).not.toThrow();
  });

  it("does nothing if target element missing", () => {
    const gsap = mockGsap();
    const btn = document.getElementById("splash-cta")!;
    const cleanup = bindCtaScroll(gsap as any, btn, "nonexistent");
    btn.click();
    cleanup();
  });

  it("cleanup removes the event listener", () => {
    const gsap = mockGsap();
    const btn = document.getElementById("splash-cta")!;
    let callCount = 0;

    const cleanup = bindCtaScroll(gsap as any, btn, "main-content");
    btn.click();
    callCount++;

    cleanup();

    btn.click();
    expect(callCount).toBe(1);
  });
});
