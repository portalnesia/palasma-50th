import { initGSAP, refreshScrollTrigger } from "./gsap";

export function setupHeroParallax(section: HTMLElement, bg: HTMLElement, content: HTMLElement) {
  const cleanupFns: (() => void)[] = [];

  async function init() {
    const { gsap, ScrollTrigger } = await initGSAP();

    const ctx = gsap.context(() => {
      const pinLength = "+=100%";

      // Grab animated elements
      const badge = content.querySelector<HTMLElement>('[data-hero="badge"]');
      const emblem = content.querySelector<HTMLElement>('[data-hero="emblem"]');
      const titleFirst = content.querySelector<HTMLElement>('[data-hero="title-line-1"]');
      const titleSecond = content.querySelector<HTMLElement>('[data-hero="title-line-2"]');
      const subtitle = content.querySelector<HTMLElement>('[data-hero="subtitle"]');
      const cta = content.querySelector<HTMLElement>('[data-hero="cta"]');
      const overlay = bg.querySelector<HTMLElement>(".hero-bg-overlay");
      const grain = bg.querySelector<HTMLElement>(".hero-bg-grain");

      // ── Single pinned timeline — all animations perfectly synced ──
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: pinLength,
          pin: true,
          pinSpacing: true,
          scrub: 1,
        },
      });

      // ── Background animations (full duration) ──

      // Background zoom
      heroTl.to(bg, { scale: 1.2, ease: "none", duration: 1 }, 0);

      // Overlay darken — covers background image for clean transition to sambutan
      if (overlay) {
        heroTl.to(overlay, { opacity: 1, ease: "none", duration: 1 }, 0);
      }

      // Grain intensifies
      if (grain) {
        heroTl.to(grain, { opacity: 0.12, ease: "none", duration: 1 }, 0);
      }

      // ── Content animations (staggered in/out) ──

      if (badge) {
        heroTl
          .fromTo(
            badge,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, ease: "power2.out", duration: 0.08 },
            0,
          )
          .to(badge, { opacity: 0, y: -20, ease: "power2.in" }, 0.65);
      }

      if (emblem) {
        heroTl
          .fromTo(
            emblem,
            { opacity: 0, scale: 0.5 },
            { opacity: 1, scale: 1, ease: "back.out(2)", duration: 0.1 },
            0.05,
          )
          .to(emblem, { opacity: 0, scale: 0.3, ease: "power2.in" }, 0.7);
      }

      if (titleFirst) {
        heroTl
          .fromTo(
            titleFirst,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, ease: "power3.out", duration: 0.12 },
            0.15,
          )
          .to(titleFirst, { opacity: 0, y: -30, ease: "power2.in" }, 0.75);
      }

      if (titleSecond) {
        heroTl
          .fromTo(
            titleSecond,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, ease: "power3.out", duration: 0.12 },
            0.2,
          )
          .to(titleSecond, { opacity: 0, y: -30, ease: "power2.in" }, 0.8);
      }

      if (subtitle) {
        heroTl
          .fromTo(
            subtitle,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, ease: "power2.out", duration: 0.12 },
            0.3,
          )
          .to(subtitle, { opacity: 0, y: -20, ease: "power2.in" }, 0.82);
      }

      if (cta) {
        heroTl
          .fromTo(
            cta,
            { opacity: 0, y: 20, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, ease: "back.out(1.5)", duration: 0.1 },
            0.4,
          )
          .to(cta, { opacity: 0, y: -20, scale: 0.95, ease: "power2.in" }, 0.85);
      }

      content.classList.add("hero-content-visible");
    });

    cleanupFns.push(() => ctx.revert());
    await refreshScrollTrigger();
  }

  init();

  return () => cleanupFns.forEach((fn) => fn());
}

export function bindHeroCta(btn: HTMLElement, targetId: string): () => void {
  function handler() {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }
  btn.addEventListener("click", handler);
  return () => btn.removeEventListener("click", handler);
}
