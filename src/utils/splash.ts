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

let playing = false;
/**
 * Set up a play/pause music toggle.
 * Returns the current playing state getter.
 */
export function setupMusicToggle(
  audio: HTMLAudioElement,
  iconOn: HTMLElement,
  iconOff: HTMLElement,
): { isPlaying: () => boolean; toggle: () => Promise<void>; turnOn: () => Promise<void> } {
  function updateUI(): void {
    iconOn.classList.toggle("hidden", !playing);
    iconOff.classList.toggle("hidden", playing);
  }

  async function turnOn(): Promise<void> {
    try {
      await audio.play();
      playing = true;
    } catch {
      /* autoplay blocked — noop */
    }
    iconOn.classList.remove("hidden");
    iconOff.classList.add("hidden");
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
    turnOn,
  };
}

/**
 * Bind a CTA button that smooth-scrolls to a target element using GSAP.
 * Returns a cleanup function.
 */
export function bindCtaScroll(btn: HTMLElement, targetId: string): () => void {
  function handler(): void {
    const audio = document.getElementById("bg-music") as HTMLAudioElement;
    const iconOn = document.getElementById("music-icon-on") as HTMLElement;
    const iconOff = document.getElementById("music-icon-off") as HTMLElement;
    const musicToggle = document.getElementById("music-toggle") as HTMLElement;

    // Unlock scroll
    document.documentElement.classList.remove("scroll-locked");
    document.body.classList.remove("scroll-locked");

    const target = document.getElementById(targetId) as HTMLElement;
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (audio && iconOn && iconOff && musicToggle && !import.meta.env.PUBLIC_DEV_MUTED_AUDIO) {
        const music = setupMusicToggle(audio, iconOn, iconOff);
        music.turnOn();
      }
    }
  }

  btn.addEventListener("click", handler);
  return () => btn.removeEventListener("click", handler);
}
