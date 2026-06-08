/**
 * Event Details — pure functions + scroll reveal.
 *
 * Pure functions are testable without DOM.
 */

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

/* ── GSAP scroll reveal (Removed for high performance) ───────────────── */

/**
 * setupEventDetailsReveal is refactored to a no-op.
 * Viewport entrance animations are handled by pure CSS transitions and a native IntersectionObserver.
 */
export function setupEventDetailsReveal(_section: HTMLElement): () => void {
  return () => {};
}
