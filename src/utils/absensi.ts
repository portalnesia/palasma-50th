import { initGSAP, refreshScrollTrigger } from "./gsap";

/**
 * Append the recipient name to Google Form prefill parameters.
 * Since we don't know the exact entry ID, we can format it nicely.
 */
export function buildGoogleFormUrl(baseUrl: string, name?: string | null): string {
  if (!name) return baseUrl;
  try {
    const url = new URL(baseUrl);
    url.searchParams.set("usp", "pp_url");
    // Standard entry key for names in prefilled form.
    // In many forms, we don't know the ID, but we can set a custom query param,
    // or if we want to support standard prefill we can use a query param 'entry.716340845'.
    // We'll use 'entry.716340845' as a default mock key or check if it already has 'entry.'
    url.searchParams.set("entry.716340845", name);
    return url.toString();
  } catch {
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}entry.716340845=${encodeURIComponent(name)}`;
  }
}

/**
 * Setup GSAP scroll trigger animation for the Absensi section and the floating CTA.
 */
export function setupAbsensiSection(section: HTMLElement, floatingBtn: HTMLElement) {
  const cleanupFns: (() => void)[] = [];

  async function init() {
    const { gsap, ScrollTrigger } = await initGSAP();

    const ctx = gsap.context(() => {
      // 1. Entrance animation for the section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "bottom 60%",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      const decor = section.querySelector('[data-reveal="absensi-decor"]');
      const title = section.querySelector('[data-reveal="absensi-title"]');
      const body = section.querySelector('[data-reveal="absensi-body"]');
      const btn = section.querySelector('[data-reveal="absensi-btn"]');

      if (decor) {
        gsap.set(decor, { opacity: 0, scale: 0.8 });
        tl.to(decor, { opacity: 1, scale: 1, duration: 0.8 }, 0);
      }
      if (title) {
        gsap.set(title, { opacity: 0, y: 30 });
        tl.to(title, { opacity: 1, y: 0, duration: 0.8 }, 0.1);
      }
      if (body) {
        gsap.set(body, { opacity: 0, y: 30 });
        tl.to(body, { opacity: 1, y: 0, duration: 0.8 }, 0.2);
      }
      if (btn) {
        gsap.set(btn, { opacity: 0, y: 30 });
        tl.to(btn, { opacity: 1, y: 0, duration: 0.8 }, 0.3);
      }

      // 2. ScrollTrigger to show/hide the floating CTA button.
      // The button becomes visible once the user scrolls to/past the section, and stays visible forever.
      gsap.set(floatingBtn, { opacity: 0, pointerEvents: "none", y: 20 });

      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        once: true,
        onEnter: () => {
          gsap.to(floatingBtn, { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.3 });
        },
      });

      // 3. Smooth scroll back to section when clicking floating CTA.
      const handleFloatingClick = (e: Event) => {
        e.preventDefault();
        const el = document.getElementById("absensi");
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY;
          gsap.to(window, {
            duration: 1.2,
            scrollTo: { y: y, autoKill: false },
            ease: "power3.out",
          });
        }
      };

      floatingBtn.addEventListener("click", handleFloatingClick);
      cleanupFns.push(() => floatingBtn.removeEventListener("click", handleFloatingClick));
    });

    cleanupFns.push(() => ctx.revert());
    await refreshScrollTrigger();
  }

  if ((window as any).splashGsapReady) {
    init();
  } else {
    window.addEventListener("splash:gsap-ready", init);
  }

  return () => {
    window.removeEventListener("splash:gsap-ready", init);
    cleanupFns.forEach((fn) => fn());
  };
}
