import { initGSAP, refreshScrollTrigger } from "./gsap";

export function setupHeroParallax(section: HTMLElement, bg: HTMLElement, content: HTMLElement) {
  const cleanupFns: (() => void)[] = [];

  async function init() {
    const { gsap } = await initGSAP();

    document.body.classList.add("js-ready");

    const ctx = gsap.context(() => {
      const pinLength = "+=100%";

      // Grab animated elements
      const badge = content.querySelector<HTMLElement>('[data-hero="badge"]');
      const titleFirst = content.querySelector<HTMLElement>('[data-hero="title-line-1"]');
      const titleSecond = content.querySelector<HTMLElement>('[data-hero="title-line-2"]');
      const titleThird = content.querySelector<HTMLElement>('[data-hero="title-line-3"]');
      const overlay = bg.querySelector<HTMLElement>(".hero-bg-gradient-4");
      const grain = bg.querySelector<HTMLElement>(".hero-bg-grain");

      // Bokeh orbs
      const bokehOrbs = bg.querySelectorAll<HTMLElement>(".hero-bokeh-orb");
      // Sparkles
      const sparkles = section.querySelectorAll<HTMLElement>(".hero-sparkle");
      // Confetti
      const confetti = section.querySelectorAll<HTMLElement>(".hero-confetti-piece");
      // Mountain image
      const mountain = section.querySelector<HTMLElement>(".hero-mountain");

      // ── Single pinned timeline ──
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

      // ═══════════════════════════════════════════════════════
      // Phase 1 (0 → 0.15): Content fades in
      // ═══════════════════════════════════════════════════════

      if (badge) {
        heroTl.fromTo(
          badge,
          { opacity: 0, y: 25, scale: 0.7, rotation: -5 },
          { opacity: 1, y: 0, scale: 1, rotation: 0, ease: "back.out(1.7)", duration: 0.12 },
          0.04,
        );
      }

      if (titleFirst) {
        heroTl.fromTo(
          titleFirst,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.1 },
          0.06,
        );
      }

      if (titleSecond) {
        heroTl.fromTo(
          titleSecond,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.1 },
          0.08,
        );
      }

      if (titleThird) {
        heroTl.fromTo(
          titleThird,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.1 },
          0.1,
        );
      }

      // ── Decorative elements fade in (0.14 → 0.28) ──
      bokehOrbs.forEach((orb, i) => {
        heroTl.fromTo(
          orb,
          { opacity: 0, scale: 0.7 },
          {
            opacity: 0.8 + Math.random() * 0.2,
            scale: 1,
            ease: "power2.out",
            duration: 0.14,
          },
          0.14 + i * 0.02,
        );
      });

      sparkles.forEach((sparkle, i) => {
        heroTl.fromTo(
          sparkle,
          { opacity: 0, scale: 0 },
          {
            opacity: 0.2 + Math.random() * 0.2,
            scale: 0.8 + Math.random() * 0.4,
            ease: "back.out(2)",
            duration: 0.08,
          },
          0.16 + i * 0.015,
        );
      });

      confetti.forEach((piece, i) => {
        heroTl.fromTo(
          piece,
          {
            opacity: 0,
            y: -20 - Math.random() * 30,
            rotation: -180 + Math.random() * 360,
            scale: 0,
          },
          {
            opacity: 0.2 + Math.random() * 0.15,
            y: 0,
            rotation: Math.random() * 360,
            scale: 1,
            ease: "power2.out",
            duration: 0.1,
          },
          0.18 + i * 0.012,
        );
      });

      // ═══════════════════════════════════════════════════════
      // Phase 2 (0.15 → 0.35): Mountain silhouettes rise from bottom
      // ═══════════════════════════════════════════════════════

      if (mountain) {
        heroTl.fromTo(
          mountain,
          { opacity: 0, y: 200 },
          { opacity: 0.5, y: 0, ease: "power2.out", duration: 0.35 },
          0.3,
        );
      }

      // ═══════════════════════════════════════════════════════
      // Phase 3 (0.65 → 0.95): HOLD — both content + mountains fully visible
      // ═══════════════════════════════════════════════════════
      // Long pause so user clearly sees mountains before text fades.

      // ═══════════════════════════════════════════════════════
      // Phase 4 (0.95 → 1.0): Content fades out — mountains still visible
      // ═══════════════════════════════════════════════════════

      if (badge) {
        heroTl.to(badge, { opacity: 0, y: -15, ease: "power2.in", duration: 0.1 }, 0.95);
      }

      if (titleFirst) {
        heroTl.to(titleFirst, { opacity: 0, y: -25, ease: "power2.in", duration: 0.1 }, 0.955);
      }

      if (titleSecond) {
        heroTl.to(titleSecond, { opacity: 0, y: -20, ease: "power2.in", duration: 0.1 }, 0.96);
      }

      if (titleThird) {
        heroTl.to(titleThird, { opacity: 0, y: -20, ease: "power2.in", duration: 0.1 }, 0.965);
      }

      // Splash decorations fade out
      confetti.forEach((piece, i) => {
        heroTl.to(
          piece,
          {
            opacity: 0,
            y: 50 + Math.random() * 60,
            rotation: "+=360",
            ease: "power2.in",
            duration: 0.08,
          },
          0.95 + i * 0.004,
        );
      });

      sparkles.forEach((sparkle) => {
        heroTl.to(
          sparkle,
          {
            opacity: 0,
            scale: 0,
            ease: "power2.in",
            duration: 0.05,
          },
          0.955,
        );
      });

      bokehOrbs.forEach((orb, i) => {
        heroTl.to(
          orb,
          {
            opacity: 0,
            y: -30 - Math.random() * 40,
            scale: 0.5,
            ease: "power2.in",
            duration: 0.08,
          },
          0.955 + i * 0.004,
        );
      });

      // Overlay/grain fade in
      if (overlay) {
        heroTl.to(overlay, { opacity: 1, ease: "none", duration: 0.1 }, 0.96);
      }

      if (grain) {
        heroTl.to(grain, { opacity: 1, ease: "none", duration: 0.1 }, 0.96);
      }
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
