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
 * Bind a CTA button that smooth-scrolls to a target element using GSAP.
 * Returns a cleanup function.
 */
export function bindCtaScroll(
  gsap: typeof globalThis.gsap,
  btn: HTMLElement,
  targetId: string,
): () => void {
  function handler(): void {
    const target = document.getElementById(targetId) as HTMLElement;
    if (target) {
      const heroTop = target.getBoundingClientRect().top + window.scrollY;
      // Hero pinned "top top" + "+=100%" → timeline progress = scroll_px / innerHeight
      // Text lines: 0.04 → 0.10, Mountain: 0.30 → 0.65
      // Target progress 0.15: all text fully visible, mountain not yet
      const targetScroll = heroTop + 0.15 * window.innerHeight;

      // Use GSAP to smoothly scroll and keep ScrollTrigger in sync
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: targetScroll, autoKill: false },
        ease: "power2.out",
      });
    }
  }

  btn.addEventListener("click", handler);
  return () => btn.removeEventListener("click", handler);
}
