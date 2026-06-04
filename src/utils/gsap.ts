/**
 * GSAP animation utilities for PALASMA 50th website.
 *
 * Import and call the init functions in your component scripts.
 * All animations degrade gracefully: content is visible without JS.
 */

export async function initGSAP() {
  const { gsap } = await import("gsap");
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}

/**
 * Generic reveal-on-scroll animation for elements with [data-reveal].
 */
export async function setupScrollReveal() {
  const { gsap, ScrollTrigger } = await initGSAP();

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
