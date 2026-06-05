import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@utils/gsap", () => {
  const mockGsap: any = {
    context: (fn: () => void) => {
      fn();
      return { revert: () => {} };
    },
    timeline: () => ({
      to: vi.fn(),
      from: vi.fn(),
      fromTo: vi.fn(),
      set: vi.fn(),
    }),
    from: vi.fn(),
    to: vi.fn(),
    set: vi.fn(),
    fromTo: vi.fn(),
    registerPlugin: vi.fn(),
  };
  return {
    initGSAP: async () => ({
      gsap: mockGsap,
      ScrollTrigger: { refresh: () => {} },
      ScrollToPlugin: {},
    }),
    refreshScrollTrigger: async () => {},
    setupScrollReveal: async () => {},
  };
});

import { setupHeroParallax } from "@utils/hero";

describe("setupHeroParallax()", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section id="hero">
        <div class="hero-bg">
          <div class="hero-bg-gradient-4"></div>
          <div class="hero-bg-grain"></div>
        </div>
        <div class="hero-content" id="hero-content">
          <h1 data-hero="title-line-1">Title</h1>
        </div>
        <div class="hero-spacer"></div>
      </section>
    `;
  });

  it("returns a cleanup function", () => {
    const section = document.getElementById("hero")!;
    const bg = section.querySelector<HTMLElement>(".hero-bg")!;
    const content = document.getElementById("hero-content")!;
    const cleanup = setupHeroParallax(section, bg, content);
    expect(typeof cleanup).toBe("function");
    cleanup();
  });

  it("does not throw when elements exist", () => {
    const section = document.getElementById("hero")!;
    const bg = section.querySelector<HTMLElement>(".hero-bg")!;
    const content = document.getElementById("hero-content")!;
    expect(() => setupHeroParallax(section, bg, content)).not.toThrow();
  });

  it("adds js-ready class to body after splash:gsap-ready", async () => {
    const section = document.getElementById("hero")!;
    const bg = section.querySelector<HTMLElement>(".hero-bg")!;
    const content = document.getElementById("hero-content")!;
    setupHeroParallax(section, bg, content);
    window.dispatchEvent(new Event("splash:gsap-ready"));
    await new Promise((r) => setTimeout(r, 10));
    expect(document.body.classList.contains("js-ready")).toBe(true);
  });
});
