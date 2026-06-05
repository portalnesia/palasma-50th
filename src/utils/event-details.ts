/**
 * Event Details — pure functions + GSAP scroll reveal.
 *
 * Pure functions are testable without DOM;
 * GSAP setup mirrors the sambutan.ts pattern.
 */

import { initGSAP, refreshScrollTrigger } from "./gsap";

/* ── Pure functions ───────────────────────────────────────── */

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isOver: boolean;
}

/**
 * Calculate countdown from `now` to `targetDate`.
 * All values are integers (floored). `isOver` is true when the target has passed.
 * Optional `now` param is for deterministic unit-testing.
 */
export function calculateCountdown(targetDate: Date, now: Date = new Date()): CountdownResult {
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isOver: false };
}

/**
 * Format a numeric value as a zero-padded 2-digit string.
 */
export function formatCountdownValue(value: number): string {
  return String(value).padStart(2, "0");
}

/* ── UI helpers (DOM-dependent) ───────────────────────────── */

interface CountdownElements {
  days: HTMLElement;
  hours: HTMLElement;
  minutes: HTMLElement;
  seconds: HTMLElement;
}

/**
 * Start updating countdown every second.
 * Returns a cleanup function that clears the interval.
 */
export function startCountdown(targetDate: Date, elements: CountdownElements): () => void {
  function update() {
    const { days, hours, minutes, seconds, isOver } = calculateCountdown(targetDate);

    if (isOver) {
      elements.days.textContent = "00";
      elements.hours.textContent = "00";
      elements.minutes.textContent = "00";
      elements.seconds.textContent = "00";
      return;
    }

    elements.days.textContent = formatCountdownValue(days);
    elements.hours.textContent = formatCountdownValue(hours);
    elements.minutes.textContent = formatCountdownValue(minutes);
    elements.seconds.textContent = formatCountdownValue(seconds);
  }

  // Run immediately, then every second
  update();
  const id = setInterval(update, 1000);

  return () => clearInterval(id);
}

/* ── GSAP scroll reveal (Apple-style scrub) ───────────────── */

/**
 * Apple-style scrub-based GSAP scroll reveal for Event Details.
 * All elements animate in progressively as the user scrolls
 * through the section — single scrub timeline, zero jank.
 */
export function setupEventDetailsReveal(section: HTMLElement): () => void {
  const cleanupFns: (() => void)[] = [];

  async function init() {
    const { gsap, ScrollTrigger } = await initGSAP();

    const ctx = gsap.context(() => {
      // ── Single scrub timeline — everything synced to scroll progress ──
      const eventTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 90%",
          end: "center center",
          scrub: 1.5,
          invalidateOnRefresh: true,
        },
      });

      // Ornamental top flourish
      const ornamentTop = section.querySelector<HTMLElement>('[data-reveal="event-ornament-top"]');
      if (ornamentTop) {
        gsap.set(ornamentTop, { opacity: 0, scale: 0.7, y: -30 });
        eventTl.to(
          ornamentTop,
          { opacity: 1, scale: 1, y: 0, ease: "power3.out", duration: 0.15 },
          0,
        );
      }

      // Title — slide up
      const title = section.querySelector<HTMLElement>('[data-reveal="event-title"]');
      if (title) {
        gsap.set(title, { opacity: 0, y: 50 });
        eventTl.to(title, { opacity: 1, y: 0, ease: "power3.out", duration: 0.2 }, 0.05);
      }

      // Countdown — scale in with bounce
      const countdown = section.querySelector<HTMLElement>('[data-reveal="event-countdown"]');
      if (countdown) {
        gsap.set(countdown, { opacity: 0, scale: 0.85, y: 30 });
        eventTl.to(
          countdown,
          { opacity: 1, scale: 1, y: 0, ease: "back.out(1.4)", duration: 0.2 },
          0.15,
        );
      }

      // Info card — rise from below
      const infoCard = section.querySelector<HTMLElement>('[data-reveal="event-info-card"]');
      if (infoCard) {
        gsap.set(infoCard, { opacity: 0, y: 60, scale: 0.96 });
        eventTl.to(
          infoCard,
          { opacity: 1, y: 0, scale: 1, ease: "power3.out", duration: 0.25 },
          0.25,
        );
      }

      // Info rows — stagger from left
      const rows = section.querySelectorAll<HTMLElement>('[data-reveal^="event-info-row-"]');
      rows.forEach((row, i) => {
        gsap.set(row, { opacity: 0, x: -25 });
        eventTl.to(row, { opacity: 1, x: 0, ease: "power2.out", duration: 0.08 }, 0.35 + i * 0.05);
      });

      // Info dividers — scale in
      const dividers = section.querySelectorAll<HTMLElement>(".event-info-divider");
      dividers.forEach((divider, i) => {
        gsap.set(divider, { opacity: 0, scaleX: 0 });
        eventTl.to(
          divider,
          { opacity: 1, scaleX: 1, ease: "power2.out", duration: 0.06 },
          0.38 + i * 0.05,
        );
      });

      // Maps section — slide up
      const maps = section.querySelector<HTMLElement>('[data-reveal="event-maps"]');
      if (maps) {
        gsap.set(maps, { opacity: 0, y: 50 });
        eventTl.to(maps, { opacity: 1, y: 0, ease: "power3.out", duration: 0.2 }, 0.55);
      }

      // Bottom ornament
      const ornamentBottom = section.querySelector<HTMLElement>(
        '[data-reveal="event-ornament-bottom"]',
      );
      if (ornamentBottom) {
        gsap.set(ornamentBottom, { opacity: 0, scale: 0.7, y: 25 });
        eventTl.to(
          ornamentBottom,
          { opacity: 1, scale: 1, y: 0, ease: "back.out(1.5)", duration: 0.12 },
          0.65,
        );
      }

      // ── Parallax — background gradients drift ──
      const bgGradients = section.querySelectorAll<HTMLElement>(
        ".event-bg-gradient-1, .event-bg-gradient-2, .event-bg-gradient-3",
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
