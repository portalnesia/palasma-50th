import { initGSAP, refreshScrollTrigger } from "./gsap";

export function setupHeroParallax(section: HTMLElement, bg: HTMLElement, content: HTMLElement) {
  const cleanupFns: (() => void)[] = [];

  async function init() {
    const { gsap } = await initGSAP();

    document.body.classList.add("js-ready");

    const skipIntro = document.body.hasAttribute("data-skip-hero-intro");

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
      // Nature leaves
      const leaves = section.querySelectorAll<HTMLElement>(".hero-leaf");

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

      if (skipIntro) {
        // When CTA clicked: make EVERYTHING fully visible immediately
        heroTl.set(
          [badge, titleFirst, titleSecond, titleThird, overlay, grain].filter(Boolean),
          { opacity: 1, y: 0, scale: 1 },
          0,
        );
        bokehOrbs.forEach((o) => heroTl.set(o, { opacity: 1, scale: 1 }, 0));
        sparkles.forEach((s) => heroTl.set(s, { opacity: 0.8, scale: 1 }, 0));
        confetti.forEach((c) => heroTl.set(c, { opacity: 0.8, scale: 1 }, 0));
        leaves.forEach((l) => heroTl.set(l, { opacity: 0 }, 0));
        return;
      }

      // ═══════════════════════════════════════════════════════
      // Phase 1 (0 → 0.15): Content fades in
      // ═══════════════════════════════════════════════════════

      if (badge) {
        heroTl.fromTo(
          badge,
          { opacity: 0, y: 20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, ease: "power2.out", duration: 0.12 },
          0.08,
        );
      }

      if (titleFirst) {
        heroTl.fromTo(
          titleFirst,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.12 },
          0.12,
        );
      }

      if (titleSecond) {
        heroTl.fromTo(
          titleSecond,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.12 },
          0.15,
        );
      }

      if (titleThird) {
        heroTl.fromTo(
          titleThird,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.12 },
          0.18,
        );
      }

      // ── Decorative elements fade in (0 → 0.18) ──
      bokehOrbs.forEach((orb, i) => {
        heroTl.fromTo(
          orb,
          { opacity: 0, scale: 0.7 },
          {
            opacity: 0.8 + Math.random() * 0.2,
            scale: 1,
            ease: "power2.out",
            duration: 0.10,
          },
          0.02 + i * 0.015,
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
            duration: 0.05,
          },
          0.05 + i * 0.01,
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
            duration: 0.06,
          },
          0.06 + i * 0.008,
        );
      });

      // ═══════════════════════════════════════════════════════
      // Phase 2 (0.15 → 0.35): Nature leaves appear while content STILL visible
      // ═══════════════════════════════════════════════════════

      leaves.forEach((leaf, i) => {
        const driftX = (Math.random() - 0.5) * 60;
        const rot = -30 + Math.random() * 60;
        heroTl.fromTo(
          leaf,
          { y: 60 + Math.random() * 40, x: driftX, opacity: 0, rotation: rot, scale: 0.5 },
          {
            y: -80 - Math.random() * 40,
            x: driftX * 0.2,
            opacity: 0.85,
            rotation: rot * 0.2,
            scale: 1,
            ease: "power1.inOut",
            duration: 0.30,
          },
          0.15 + i * 0.012,
        );
      });

      // ═══════════════════════════════════════════════════════
      // Phase 3 (0.35 → 0.80): HOLD — both content + leaves fully visible
      // ═══════════════════════════════════════════════════════
      // Long pause so user clearly sees decorations before text fades.

      // ═══════════════════════════════════════════════════════
      // Phase 4 (0.80 → 0.95): Content fades out — leaves still visible
      // ═══════════════════════════════════════════════════════

      if (badge) {
        heroTl.to(badge, { opacity: 0, y: -15, ease: "power2.in", duration: 0.15 }, 0.80);
      }

      if (titleFirst) {
        heroTl.to(titleFirst, { opacity: 0, y: -25, ease: "power2.in", duration: 0.15 }, 0.83);
      }

      if (titleSecond) {
        heroTl.to(titleSecond, { opacity: 0, y: -20, ease: "power2.in", duration: 0.15 }, 0.86);
      }

      if (titleThird) {
        heroTl.to(titleThird, { opacity: 0, y: -20, ease: "power2.in", duration: 0.15 }, 0.89);
      }

      // Original splash decorations fade out
      confetti.forEach((piece, i) => {
        heroTl.to(
          piece,
          {
            opacity: 0,
            y: 50 + Math.random() * 60,
            rotation: "+=360",
            ease: "power2.in",
            duration: 0.12,
          },
          0.82 + i * 0.006,
        );
      });

      sparkles.forEach((sparkle) => {
        heroTl.to(
          sparkle,
          {
            opacity: 0,
            scale: 0,
            ease: "power2.in",
            duration: 0.06,
          },
          0.84,
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
            duration: 0.12,
          },
          0.86 + i * 0.008,
        );
      });

      // Overlay/grain fade in
      if (overlay) {
        heroTl.to(overlay, { opacity: 1, ease: "none", duration: 0.2 }, 0.90);
      }

      if (grain) {
        heroTl.to(grain, { opacity: 1, ease: "none", duration: 0.2 }, 0.90);
      }

      // ═══════════════════════════════════════════════════════
      // Phase 5 (0.92 → 1.0): Leaves float up out of viewport
      // ═══════════════════════════════════════════════════════

      leaves.forEach((leaf, i) => {
        heroTl.to(leaf, {
          y: -700 - Math.random() * 100,
          rotation: -15 + Math.random() * 30,
          ease: "power1.inOut",
          duration: 0.30,
        }, 0.92 + i * 0.008);
      });
    });
    cleanupFns.push(() => ctx.revert());
    await new Promise<void>((r) => setTimeout(r, 50));
    await refreshScrollTrigger();
  }
  init();
  return () => cleanupFns.forEach((fn) => fn());
}
