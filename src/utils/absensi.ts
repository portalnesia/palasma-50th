/**
 * Prefills the Google Form URL and manages Section interactions (floating button visibility & scroll)
 * using pure high-performance CSS and native IntersectionObserver.
 */

/**
 * Append the recipient name to Google Form prefill parameters.
 */
export function buildGoogleFormUrl(baseUrl: string, name?: string | null): string {
  if (!name) return baseUrl;
  try {
    const url = new URL(baseUrl);
    url.searchParams.set("usp", "pp_url");
    url.searchParams.set("entry.716340845", name);
    return url.toString();
  } catch {
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}entry.716340845=${encodeURIComponent(name)}`;
  }
}

/**
 * Setup scroll reveal interaction for the Absensi section and the floating CTA.
 * Uses IntersectionObserver instead of GSAP for top performance.
 */
export function setupAbsensiSection(section: HTMLElement, floatingBtn: HTMLElement) {
  const cleanupFns: (() => void)[] = [];

  // Add class for JS reveal state
  section.classList.add("js-enabled");

  // Show/Hide Floating CTA via IntersectionObserver
  if (typeof window !== "undefined" && "IntersectionObserver" in window) {
    // Hide initially via CSS
    floatingBtn.style.opacity = "0";
    floatingBtn.style.pointerEvents = "none";
    floatingBtn.style.transform = "translateY(20px)";
    floatingBtn.style.transition = "opacity 0.4s ease, transform 0.4s ease";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            floatingBtn.style.opacity = "1";
            floatingBtn.style.pointerEvents = "auto";
            floatingBtn.style.transform = "translateY(0)";
            observer.disconnect(); // Keep visible permanently once shown
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
      },
    );

    observer.observe(section);
    cleanupFns.push(() => observer.disconnect());
  }

  // Smooth scroll back to section when clicking floating CTA
  const handleFloatingClick = (e: Event) => {
    e.preventDefault();
    const el = document.getElementById("absensi");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  floatingBtn.addEventListener("click", handleFloatingClick);
  cleanupFns.push(() => floatingBtn.removeEventListener("click", handleFloatingClick));

  return () => {
    cleanupFns.forEach((fn) => fn());
  };
}
