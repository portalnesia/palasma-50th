import { describe, it, expect, beforeEach } from "vitest";
import { setupSambutanReveal, parseBodyParagraphs } from "@utils/sambutan";

describe("parseBodyParagraphs()", () => {
  it("splits body on double newlines", () => {
    const body = "Para 1\n\nPara 2\n\nPara 3";
    const result = parseBodyParagraphs(body);
    expect(result).toEqual(["Para 1", "Para 2", "Para 3"]);
  });

  it("trims whitespace from paragraphs", () => {
    const body = "  Para 1  \n\n  Para 2  ";
    const result = parseBodyParagraphs(body);
    expect(result).toEqual(["Para 1", "Para 2"]);
  });

  it("filters out empty paragraphs", () => {
    const body = "Para 1\n\n\n\nPara 2";
    const result = parseBodyParagraphs(body);
    expect(result).toEqual(["Para 1", "Para 2"]);
  });

  it("returns single paragraph if no double newline", () => {
    const body = "Single paragraph text";
    const result = parseBodyParagraphs(body);
    expect(result).toEqual(["Single paragraph text"]);
  });

  it("handles empty string", () => {
    const result = parseBodyParagraphs("");
    expect(result).toEqual([]);
  });
});

describe("setupSambutanReveal()", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section id="sambutan">
        <div data-reveal="sambutan-ornament-top" class="decor-line"></div>
        <h2 data-reveal="sambutan-title">Title</h2>
        <div data-reveal="sambutan-photo">
          <img src="/dummy.jpg" alt="Photo" />
        </div>
        <div data-reveal="sambutan-card">
          <span data-reveal="sambutan-quote">❝</span>
          <p data-reveal="sambutan-para-0">Body text</p>
          <span data-reveal="sambutan-quote">❞</span>
        </div>
        <div data-reveal="sambutan-author">Author</div>
        <div data-reveal="sambutan-ornament-bottom">
          <span class="line"></span>
        </div>
      </section>
    `;
  });

  it("returns a cleanup function", () => {
    const section = document.getElementById("sambutan")!;
    const cleanup = setupSambutanReveal(section);
    expect(typeof cleanup).toBe("function");
    cleanup();
  });

  it("does not throw when elements exist", () => {
    const section = document.getElementById("sambutan")!;
    expect(() => setupSambutanReveal(section)).not.toThrow();
  });

  it("does not throw on minimal DOM", () => {
    document.body.innerHTML = `<section id="sambutan"><div></div></section>`;
    const section = document.getElementById("sambutan")!;
    const cleanup = setupSambutanReveal(section);
    expect(() => cleanup()).not.toThrow();
  });
});
