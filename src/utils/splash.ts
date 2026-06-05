/**
 * Pure logic functions for the Splash screen.
 *
 * Extracted from SplashScreen.astro so they can be unit-tested
 * without DOM or browser dependencies.
 */

/** Extract the `?to=` recipient name from a URL search string. Returns null if absent. */
export function getRecipientName(searchString: string): string | null {
  const params = new URLSearchParams(searchString);
  return params.get("to");
}

/**
 * Set up a play/pause music toggle.
 * Returns the current playing state getter.
 */
export function setupMusicToggle(
  audio: HTMLAudioElement,
  iconOn: HTMLElement,
  iconOff: HTMLElement,
): { isPlaying: () => boolean; toggle: () => Promise<void> } {
  let playing = false;

  function updateUI(): void {
    iconOn.classList.toggle("hidden", !playing);
    iconOff.classList.toggle("hidden", playing);
  }

  async function toggle(): Promise<void> {
    if (playing) {
      audio.pause();
      playing = false;
    } else {
      try {
        await audio.play();
        playing = true;
      } catch {
        /* autoplay blocked — noop */
      }
    }
    updateUI();
  }

  return {
    isPlaying: () => playing,
    toggle,
  };
}

/**
 * Bind a CTA button that smooth-scrolls to a target element.
 * Returns a cleanup function.
 */
export function bindCtaScroll(btn: HTMLElement, targetId: string): () => void {
  function handler(): void {
    const target = document.getElementById(targetId);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  }

  btn.addEventListener("click", handler);
  return () => btn.removeEventListener("click", handler);
}
