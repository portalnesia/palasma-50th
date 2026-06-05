import { describe, it, expect, beforeEach } from "vitest";
import { setupHeroParallax, bindHeroCta } from "@utils/hero";

describe("setupHeroParallax()", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section id="hero">
        <div class="hero-bg"><div class="hero-bg-overlay"></div></div>
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
});

describe("bindHeroCta()", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <a href="#event-details" id="hero-cta">CTA</a>
      <div id="event-details"></div>
    `;
  });

  it("returns a cleanup function", () => {
    const btn = document.getElementById("hero-cta")!;
    const cleanup = bindHeroCta(btn, "event-details");
    expect(typeof cleanup).toBe("function");
    cleanup();
  });

  it("does not throw when target exists", () => {
    const btn = document.getElementById("hero-cta")!;
    expect(() => bindHeroCta(btn, "event-details")).not.toThrow();
  });

  it("does nothing if target element missing", () => {
    const btn = document.getElementById("hero-cta")!;
    const cleanup = bindHeroCta(btn, "nonexistent");
    btn.click();
    cleanup();
  });

  it("cleanup removes the event listener", () => {
    const btn = document.getElementById("hero-cta")!;
    let callCount = 0;

    const cleanup = bindHeroCta(btn, "event-details");
    btn.click();
    callCount++;

    cleanup();

    btn.click();
    expect(callCount).toBe(1);
  });

  it("does not throw on non-anchor element", () => {
    document.body.innerHTML = `<button id="hero-cta">CTA</button>`;
    const btn = document.getElementById("hero-cta")!;
    const cleanup = bindHeroCta(btn, "event-details");
    btn.click();
    cleanup();
  });
});
