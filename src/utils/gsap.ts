/**
 * GSAP animation utilities for PALASMA 50th website.
 *
 * Import and call the init functions in your component scripts.
 * All animations degrade gracefully: content is visible without JS.
 */

export async function initGSAP() {
  const { gsap } = await import("gsap");
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  const { ScrollToPlugin } = await import("gsap/ScrollToPlugin");
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  return { gsap, ScrollTrigger, ScrollToPlugin };
}

/**
 * Refresh ScrollTrigger calculations.
 * Uses double-rAF to wait for browser layout after DOM changes.
 */
export async function refreshScrollTrigger() {
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        resolve();
      });
    });
  });
}

/**
 * Generic reveal-on-scroll animation for elements with [data-reveal].
 */
export async function setupScrollReveal() {
  const { gsap } = await initGSAP();

  const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
  elements.forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
    });
  });
}
