import { initGSAP, refreshScrollTrigger } from "./gsap";

export function setupSambutanReveal(section: HTMLElement) {
  const cleanupFns: (() => void)[] = [];

  async function init() {
    const { gsap, ScrollTrigger } = await initGSAP();

    const ctx = gsap.context(() => {
      // ── Apple-style scrub timeline ──
      const sambutanTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 90%",
          end: "center center",
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });

      // Ornamental top flourish — sweep in from above
      const ornamentTop = section.querySelector<HTMLElement>(
        '[data-reveal="sambutan-ornament-top"]',
      );
      if (ornamentTop) {
        gsap.set(ornamentTop, { opacity: 0, scale: 0.7, y: -30 });
        sambutanTl.to(
          ornamentTop,
          { opacity: 1, scale: 1, y: 0, ease: "power3.out", duration: 0.15 },
          0,
        );
      }

      // Title — slide up with parallax
      const titleEl = section.querySelector<HTMLElement>('[data-reveal="sambutan-title"]');
      if (titleEl) {
        gsap.set(titleEl, { opacity: 0, y: 50 });
        sambutanTl.to(
          titleEl,
          { opacity: 1, y: 0, ease: "power3.out", duration: 0.2 },
          0.05,
        );
      }

      // Photo — scale up from small with glow
      const photoEl = section.querySelector<HTMLElement>('[data-reveal="sambutan-photo"]');
      if (photoEl) {
        gsap.set(photoEl, { opacity: 0, scale: 0.5, y: 40 });
        sambutanTl.to(
          photoEl,
          { opacity: 1, scale: 1, y: 0, ease: "back.out(1.5)", duration: 0.25 },
          0.1,
        );
      }

      // Author — subtle fade
      const authorEl = section.querySelector<HTMLElement>('[data-reveal="sambutan-author"]');
      if (authorEl) {
        gsap.set(authorEl, { opacity: 0, y: 15 });
        sambutanTl.to(
          authorEl,
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.15 },
          0.2,
        );
      }

      // Glass card — rise from below
      const cardEl = section.querySelector<HTMLElement>('[data-reveal="sambutan-card"]');
      if (cardEl) {
        gsap.set(cardEl, { opacity: 0, y: 70, scale: 0.96 });
        sambutanTl.to(
          cardEl,
          { opacity: 1, y: 0, scale: 1, ease: "power3.out", duration: 0.25 },
          0.25,
        );
      }

      // Quote marks — pop in
      const quoteOpen = section.querySelector<HTMLElement>(
        '.sambutan-quote-open[data-reveal="sambutan-quote"]',
      );
      if (quoteOpen) {
        gsap.set(quoteOpen, { opacity: 0, scale: 0.3, rotate: -15 });
        sambutanTl.to(
          quoteOpen,
          { opacity: 1, scale: 1, rotate: 0, ease: "back.out(2.5)", duration: 0.12 },
          0.35,
        );
      }

      const quoteClose = section.querySelector<HTMLElement>(
        '.sambutan-quote-close[data-reveal="sambutan-quote"]',
      );
      if (quoteClose) {
        gsap.set(quoteClose, { opacity: 0, scale: 0.3, rotate: 15 });
        sambutanTl.to(
          quoteClose,
          { opacity: 1, scale: 1, rotate: 0, ease: "back.out(2.5)", duration: 0.12 },
          0.38,
        );
      }

      // Paragraphs — stagger up from below
      const paras = section.querySelectorAll<HTMLElement>('[data-reveal^="sambutan-para-"]');
      paras.forEach((para, i) => {
        gsap.set(para, { opacity: 0, y: 35 });
        sambutanTl.to(
          para,
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            duration: 0.1,
          },
          0.4 + i * 0.06,
        );
      });

      // Bottom ornament — sweep in
      const ornamentBottom = section.querySelector<HTMLElement>(
        '[data-reveal="sambutan-ornament-bottom"]',
      );
      if (ornamentBottom) {
        gsap.set(ornamentBottom, { opacity: 0, scale: 0.7, y: 25 });
        sambutanTl.to(
          ornamentBottom,
          { opacity: 1, scale: 1, y: 0, ease: "back.out(1.5)", duration: 0.12 },
          0.6,
        );
      }

      // ── Parallax layer — background gradients drift with scroll ──
      const bgGradients = section.querySelectorAll<HTMLElement>(
        ".sambutan-bg-gradient-1, .sambutan-bg-gradient-2, .sambutan-bg-gradient-3",
      );
      bgGradients.forEach((grad, i) => {
        gsap.to(grad, {
          y: `${(i + 1) * -15}`,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    });

    cleanupFns.push(() => ctx.revert());
    await refreshScrollTrigger();
  }

  // Wait for splash pin spacer to exist before computing ScrollTrigger positions
  window.addEventListener("splash:gsap-ready", init, { once: true });
  // Safety fallback
  const safetyTimeout = setTimeout(init, 2000);
  window.addEventListener("splash:gsap-ready", () => clearTimeout(safetyTimeout), { once: true });

  return () => {
    clearTimeout(safetyTimeout);
    window.removeEventListener("splash:gsap-ready", init);
    cleanupFns.forEach((fn) => fn());
  };
}

export function parseBodyParagraphs(body: string): string[] {
  return body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}
