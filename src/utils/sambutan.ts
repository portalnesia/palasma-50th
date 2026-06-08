/**
 * Setup animations for the Sambutan section.
 * Refactored to remove GSAP and scroll-hold for high performance.
 */
export function setupSambutanReveal(_section: HTMLElement) {
  return () => {};
}

export function parseBodyParagraphs(body: string): string[] {
  return body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}
