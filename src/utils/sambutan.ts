import { initGSAP, refreshScrollTrigger } from "./gsap";

export function setupSambutanReveal(section: HTMLElement) {
  const cleanupFns: (() => void)[] = [];

  async function init() {
    const { gsap } = await initGSAP();

    const ctx = gsap.context(() => {
      // ═══════════════════════════════════════════════════════
      // ScrollTrigger 1: Content reveal (scrub, NO pin)
      // Content scrolls normally, reveals as user scrolls in
      // ═══════════════════════════════════════════════════════

      const contentTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "center center",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      const ornamentTop = section.querySelector<HTMLElement>(
        '[data-reveal="sambutan-ornament-top"]',
      );
      if (ornamentTop) {
        gsap.set(ornamentTop, { opacity: 0, scale: 0.7, y: -30 });
        contentTl.to(
          ornamentTop,
          { opacity: 1, scale: 1, y: 0, ease: "power3.out", duration: 1 },
          0,
        );
      }

      const titleEl = section.querySelector<HTMLElement>('[data-reveal="sambutan-title"]');
      if (titleEl) {
        gsap.set(titleEl, { opacity: 0, y: 50 });
        contentTl.to(titleEl, { opacity: 1, y: 0, ease: "power3.out", duration: 1 }, 0.1);
      }

      const photoEl = section.querySelector<HTMLElement>('[data-reveal="sambutan-photo"]');
      if (photoEl) {
        gsap.set(photoEl, { opacity: 0, scale: 0.5, y: 40 });
        contentTl.to(
          photoEl,
          { opacity: 1, scale: 1, y: 0, ease: "back.out(1.5)", duration: 1.2 },
          0.2,
        );
      }

      const authorEl = section.querySelector<HTMLElement>('[data-reveal="sambutan-author"]');
      if (authorEl) {
        gsap.set(authorEl, { opacity: 0, y: 15 });
        contentTl.to(authorEl, { opacity: 1, y: 0, ease: "power2.out", duration: 0.8 }, 0.3);
      }

      const cardEl = section.querySelector<HTMLElement>('[data-reveal="sambutan-card"]');
      if (cardEl) {
        gsap.set(cardEl, { opacity: 0, y: 70, scale: 0.96 });
        contentTl.to(
          cardEl,
          { opacity: 1, y: 0, scale: 1, ease: "power3.out", duration: 1.2 },
          0.35,
        );
      }

      const quoteOpen = section.querySelector<HTMLElement>(
        '.sambutan-quote-open[data-reveal="sambutan-quote"]',
      );
      if (quoteOpen) {
        gsap.set(quoteOpen, { opacity: 0, scale: 0.3, rotate: -15 });
        contentTl.to(
          quoteOpen,
          { opacity: 1, scale: 1, rotate: 0, ease: "back.out(2.5)", duration: 0.8 },
          0.5,
        );
      }

      const quoteClose = section.querySelector<HTMLElement>(
        '.sambutan-quote-close[data-reveal="sambutan-quote"]',
      );
      if (quoteClose) {
        gsap.set(quoteClose, { opacity: 0, scale: 0.3, rotate: 15 });
        contentTl.to(
          quoteClose,
          { opacity: 1, scale: 1, rotate: 0, ease: "back.out(2.5)", duration: 0.8 },
          0.55,
        );
      }

      const paras = section.querySelectorAll<HTMLElement>('[data-reveal^="sambutan-para-"]');
      paras.forEach((para, i) => {
        gsap.set(para, { opacity: 0, y: 35 });
        contentTl.to(para, { opacity: 1, y: 0, ease: "power2.out", duration: 0.8 }, 0.6 + i * 0.15);
      });

      const ornamentBottom = section.querySelector<HTMLElement>(
        '[data-reveal="sambutan-ornament-bottom"]',
      );
      if (ornamentBottom) {
        gsap.set(ornamentBottom, { opacity: 0, scale: 0.7, y: 25 });
        contentTl.to(
          ornamentBottom,
          { opacity: 1, scale: 1, y: 0, ease: "back.out(1.5)", duration: 0.8 },
          0.8,
        );
      }

      // ═══════════════════════════════════════════════════════
      // ScrollTrigger 2: Pin at END of section, confetti burst
      // Pins when section bottom hits viewport bottom,
      // user has already scrolled through all content.
      // Confetti bursts from bottom-center, spreading outward
      // like a celebration.
      // ═══════════════════════════════════════════════════════

      const campItems = section.querySelectorAll<HTMLElement>("[data-reveal^='camp-']");

      const decorTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "bottom 115%",
          end: "+=100%",
          pin: true,
          pinSpacing: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Burst from bottom-center outward — each piece fans out at a unique angle
      const total = campItems.length;
      campItems.forEach((item, i) => {
        // Spread angle: -70° (left) to +70° (right), evenly distributed
        const angle = (i / (total - 1) - 0.5) * 140;
        const rad = (angle * Math.PI) / 180;
        // Travel distance: how far the piece flies from origin
        const dist = 35 + Math.random() * 15;
        const endX = Math.sin(rad) * dist;
        const endY = -Math.cos(rad) * dist;

        decorTl.fromTo(
          item,
          {
            opacity: 0,
            x: "0vw",
            y: "40vh",
            rotation: 0,
            scale: 0.3,
          },
          {
            opacity: 1,
            x: `${endX}vw`,
            y: `${endY}vh`,
            rotation: (Math.random() - 0.5) * 360,
            scale: 1,
            ease: "power3.out",
            duration: 1.5,
          },
          i * 0.012,
        );
      });

      // ═══════════════════════════════════════════════════════
      // Parallax: background gradients drift with scroll
      // ═══════════════════════════════════════════════════════

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
  window.addEventListener("splash:gsap-ready", init);

  return () => {
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
