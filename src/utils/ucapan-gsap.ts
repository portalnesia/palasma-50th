import { initGSAP, refreshScrollTrigger } from "./gsap";

export function setupUcapanAnimations(section: HTMLElement) {
  const cleanupFns: (() => void)[] = [];

  async function init() {
    const { gsap } = await initGSAP();

    const ctx = gsap.context(() => {
      // ── Scrub timeline — in only, no pin ──
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "center center",
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });

      // Top ornament — sweep in
      const ornamentTop = section.querySelector<HTMLElement>(".event-ornament-top");
      if (ornamentTop) {
        gsap.set(ornamentTop, { opacity: 0, scale: 0.7, y: -30 });
        tl.to(ornamentTop, { opacity: 1, scale: 1, y: 0, ease: "power3.out", duration: 0.15 }, 0);
      }

      // Title — slide up
      const title = section.querySelector<HTMLElement>(".ucapan-title");
      if (title) {
        gsap.set(title, { opacity: 0, y: 50 });
        tl.to(title, { opacity: 1, y: 0, ease: "power3.out", duration: 0.2 }, 0.05);
      }

      // Stars — pop in
      const stars = section.querySelectorAll<HTMLElement>(".ucapan-title-star");
      stars.forEach((star, i) => {
        gsap.set(star, { opacity: 0, scale: 0, rotation: -180 });
        tl.to(star, { opacity: 0.7, scale: 1, rotation: 0, ease: "back.out(2)", duration: 0.12 }, 0.15 + i * 0.04);
      });

      // Subtitle — fade up
      const subtitle = section.querySelector<HTMLElement>(".ucapan-subtitle");
      if (subtitle) {
        gsap.set(subtitle, { opacity: 0, y: 25 });
        tl.to(subtitle, { opacity: 0.9, y: 0, ease: "power2.out", duration: 0.12 }, 0.22);
      }

      // Divider — expand
      const divider = section.querySelector<HTMLElement>(".ucapan-divider");
      if (divider) {
        gsap.set(divider, { opacity: 0, scaleX: 0 });
        tl.to(divider, { opacity: 1, scaleX: 1, ease: "power2.out", duration: 0.1 }, 0.3);
      }

      // Body — slide from right
      const body = section.querySelector<HTMLElement>(".ucapan-body");
      if (body) {
        gsap.set(body, { opacity: 0, x: 40 });
        tl.to(body, { opacity: 0.8, x: 0, ease: "power2.out", duration: 0.15 }, 0.35);
      }

      // ── Parallax — scrub, no pin ──
      const mountainBack = section.querySelector<HTMLElement>(".ucapan-mountain-back");
      if (mountainBack) {
        gsap.to(mountainBack, {
          yPercent: -15,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
        });
      }

      const mountainFront = section.querySelector<HTMLElement>(".ucapan-mountain-front");
      if (mountainFront) {
        gsap.to(mountainFront, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
        });
      }

      const treesLeft = section.querySelector<HTMLElement>(".ucapan-trees-left");
      if (treesLeft) {
        gsap.to(treesLeft, {
          y: -30,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
        });
      }

      const treesRight = section.querySelector<HTMLElement>(".ucapan-trees-right");
      if (treesRight) {
        gsap.to(treesRight, {
          y: -20,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
        });
      }
    });

    cleanupFns.push(() => ctx.revert());
    await refreshScrollTrigger();
  }

  window.addEventListener("splash:gsap-ready", init);
  const safetyTimeout = setTimeout(init, 3000);
  window.addEventListener("splash:gsap-ready", () => clearTimeout(safetyTimeout), { once: true });

  return () => {
    clearTimeout(safetyTimeout);
    window.removeEventListener("splash:gsap-ready", init);
    cleanupFns.forEach((fn) => fn());
  };
}
