import { initGSAP, refreshScrollTrigger } from "./gsap";

export function setupSambutanReveal(section: HTMLElement) {
  const cleanupFns: (() => void)[] = [];

  async function init() {
    const { gsap, ScrollTrigger } = await initGSAP();

    const ctx = gsap.context(() => {
      // Ornamental top flourish
      const ornamentTop = section.querySelector<HTMLElement>(
        '[data-reveal="sambutan-ornament-top"]',
      );
      if (ornamentTop) {
        gsap.from(ornamentTop, {
          opacity: 0,
          scale: 0.7,
          y: -20,
          duration: 1.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ornamentTop,
            start: "top 80%",
            once: true,
          },
        });
      }

      // Title
      const titleEl = section.querySelector<HTMLElement>('[data-reveal="sambutan-title"]');
      if (titleEl) {
        gsap.from(titleEl, {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleEl,
            start: "top 80%",
            once: true,
          },
        });
      }

      // Photo wrapper
      const photoEl = section.querySelector<HTMLElement>('[data-reveal="sambutan-photo"]');
      if (photoEl) {
        gsap.from(photoEl, {
          opacity: 0,
          scale: 0.6,
          y: 30,
          duration: 1.2,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: photoEl,
            start: "top 80%",
            once: true,
          },
        });
      }

      // Glass card
      const cardEl = section.querySelector<HTMLElement>('[data-reveal="sambutan-card"]');
      if (cardEl) {
        gsap.from(cardEl, {
          opacity: 0,
          y: 60,
          scale: 0.95,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardEl,
            start: "top 75%",
            once: true,
          },
        });
      }

      // Quote marks
      const quoteMarks = section.querySelectorAll<HTMLElement>('[data-reveal="sambutan-quote"]');
      quoteMarks.forEach((mark) => {
        gsap.from(mark, {
          opacity: 0,
          scale: 0.3,
          rotate: -10,
          duration: 0.8,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: mark,
            start: "top 80%",
            once: true,
          },
        });
      });

      // Paragraphs staggered
      const paras = section.querySelectorAll<HTMLElement>('[data-reveal^="sambutan-para-"]');
      paras.forEach((para, i) => {
        gsap.from(para, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power2.out",
          delay: i * 0.15,
          scrollTrigger: {
            trigger: para,
            start: "top 80%",
            once: true,
          },
        });
      });

      // Author info
      const authorEl = section.querySelector<HTMLElement>('[data-reveal="sambutan-author"]');
      if (authorEl) {
        gsap.from(authorEl, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: authorEl,
            start: "top 80%",
            once: true,
          },
        });
      }

      // Ornamental bottom
      const ornamentBottom = section.querySelector<HTMLElement>(
        '[data-reveal="sambutan-ornament-bottom"]',
      );
      if (ornamentBottom) {
        gsap.from(ornamentBottom, {
          opacity: 0,
          scale: 0.7,
          y: 20,
          duration: 1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: ornamentBottom,
            start: "top 80%",
            once: true,
          },
        });
      }
    });

    cleanupFns.push(() => ctx.revert());

    // Refresh ScrollTrigger after all animations are registered
    await refreshScrollTrigger();
  }

  init();

  return () => cleanupFns.forEach((fn) => fn());
}

export function parseBodyParagraphs(body: string): string[] {
  return body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}
