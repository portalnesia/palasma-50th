import { describe, it, expect, beforeEach } from "vitest";
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

  it("adds js-ready class to body", () => {
    const section = document.getElementById("hero")!;
    const bg = section.querySelector<HTMLElement>(".hero-bg")!;
    const content = document.getElementById("hero-content")!;
    setupHeroParallax(section, bg, content);
    expect(document.body.classList.contains("js-ready")).toBe(true);
  });
});
