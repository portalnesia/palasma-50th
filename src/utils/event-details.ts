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

/* ── GSAP scroll reveal ───────────────────────────────────── */

/**
 * Setup GSAP scroll-triggered reveal animations for the Event Details section.
 * Returns a cleanup function.
 */
export function setupEventDetailsReveal(section: HTMLElement): () => void {
  const cleanupFns: (() => void)[] = [];

  async function init() {
    const { gsap, ScrollTrigger } = await initGSAP();

    const ctx = gsap.context(() => {
      // Ornamental top flourish
      const ornamentTop = section.querySelector<HTMLElement>('[data-reveal="event-ornament-top"]');
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
      const title = section.querySelector<HTMLElement>('[data-reveal="event-title"]');
      if (title) {
        gsap.from(title, {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: title,
            start: "top 80%",
            once: true,
          },
        });
      }

      // Countdown container
      const countdown = section.querySelector<HTMLElement>('[data-reveal="event-countdown"]');
      if (countdown) {
        gsap.from(countdown, {
          opacity: 0,
          scale: 0.9,
          duration: 1,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: countdown,
            start: "top 80%",
            once: true,
          },
        });
      }

      // Info card
      const infoCard = section.querySelector<HTMLElement>('[data-reveal="event-info-card"]');
      if (infoCard) {
        gsap.from(infoCard, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: infoCard,
            start: "top 80%",
            once: true,
          },
        });
      }

      // Info rows — staggered
      const rows = section.querySelectorAll<HTMLElement>('[data-reveal^="event-info-row-"]');
      rows.forEach((row, i) => {
        gsap.from(row, {
          opacity: 0,
          x: -20,
          duration: 0.6,
          ease: "power2.out",
          delay: i * 0.1,
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
            once: true,
          },
        });
      });

      // Maps
      const maps = section.querySelector<HTMLElement>('[data-reveal="event-maps"]');
      if (maps) {
        gsap.from(maps, {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: maps,
            start: "top 85%",
            once: true,
          },
        });
      }

      // Ornamental bottom
      const ornamentBottom = section.querySelector<HTMLElement>(
        '[data-reveal="event-ornament-bottom"]',
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
    await refreshScrollTrigger();
  }

  init();

  return () => cleanupFns.forEach((fn) => fn());
}
