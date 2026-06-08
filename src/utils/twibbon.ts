/**
 * Twibbon Maker — pure functions + GSAP scroll reveal + Croppie UI glue.
 *
 * Architecture follows the Croppie.tsx reference:
 *  - Croppie boundary → transparent background
 *  - Croppie viewport → twibbon frame overlay via CSS background-image
 *  - Hidden <canvas> → final composite (cropped image + twibbon frame)
 *  - Download → canvas composite then toDataURL()
 */

/* ── Pure functions ───────────────────────────────────────── */

/**
 * Validate that a File is an allowed image type and within size limit.
 */
export function validateImageFile(
  file: File,
  maxSizeBytes: number = 5 * 1024 * 1024,
): { valid: true } | { valid: false; reason: string } {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      reason: "Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.",
    };
  }

  if (file.size > maxSizeBytes) {
    const maxMB = Math.round(maxSizeBytes / (1024 * 1024));
    return {
      valid: false,
      reason: `Ukuran file terlalu besar. Maksimal ${maxMB}MB.`,
    };
  }

  return { valid: true };
}

/**
 * Format today's date as YYYY-MM-DD for default filename.
 */
export function formatDateFilename(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Draw an image onto a canvas, then draw the twibbon frame on top.
 * Both are stretched to fill the full canvas (drawImage at canvas.width × canvas.height),
 * matching the CSS viewport frame overlay (background-size: 100% 100%).
 */
export function compositeFrame(
  imageSrc: string,
  frameSrc: string,
  canvas: HTMLCanvasElement,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return reject(new Error("Cannot get canvas context"));

    const cw = canvas.width;
    const ch = canvas.height;

    const photo = new Image();
    photo.onload = () => {
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(photo, 0, 0, cw, ch);

      if (frameSrc) {
        const frame = new Image();
        frame.onload = () => {
          ctx.drawImage(frame, 0, 0, cw, ch);
          resolve();
        };
        frame.onerror = () => reject(new Error("Gagal memuat twibbon frame"));
        frame.src = frameSrc;
      } else {
        reject(new Error("Frame source tidak tersedia"));
      }
    };
    photo.onerror = () => reject(new Error("Gagal memuat gambar"));
    photo.src = imageSrc;
  });
}

/* ── UI helpers (DOM-dependent) ───────────────────────────── */

/**
 * Create a hidden anchor, set its href + download attribute, append to body,
 * and click it to trigger a file download.
 *
 * @returns The created HTMLAnchorElement (caller is responsible for cleanup).
 */
export function triggerDownload(href: string, filename: string): HTMLAnchorElement {
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  return a;
}

/**
 * Initialize Croppie + hidden canvas + all UI interactions.
 *
 * Key architecture from Croppie.tsx reference:
 *  1. Boundary gets transparent background (transparent.png)
 *  2. Viewport gets twibbon frame as CSS background-image (zIndex: 5)
 *  3. Hidden canvas at 1000×1000 for final output
 *  4. Boundary/viewport size adapts to container width (responsive)
 *  5. Download = canvas composite: draw cropped image → draw frame → export PNG
 */
export function setupTwibbon(section: HTMLElement): () => void {
  const cleanupFns: (() => void)[] = [];

  async function setupUI() {
    const Croppie = (await import("croppie")).default;

    // ── Gather DOM elements ──
    const fileInput = section.querySelector<HTMLInputElement>("#twibbon-file-input");
    const previewContainer = section.querySelector<HTMLElement>("#twibbon-preview");
    const croppieContainer = section.querySelector<HTMLElement>("#twibbon-croppie");
    const controlsContainer = section.querySelector<HTMLElement>("#twibbon-controls");
    const btnDownload = section.querySelector<HTMLElement>("#twibbon-btn-download");
    const btnReset = section.querySelector<HTMLElement>("#twibbon-btn-reset");
    const statusMessage = section.querySelector<HTMLElement>("#twibbon-status");
    const uploadLabel = section.querySelector<HTMLElement>("#twibbon-upload-label");
    const canvas = section.querySelector<HTMLCanvasElement>("#twibbon-canvas");

    if (!fileInput || !croppieContainer || !canvas) return;

    // ── Twibbon frame URL from data attribute (set by Astro from ASSETS.twibbon.frame) ──
    const frameSrc = canvas.dataset.frame || "";

    // ── Canvas setup (like Croppie.tsx: canvas hidden, 1000×1000) ──

    let croppieInstance: any = null;

    /** Compute responsive size (same as Croppie.tsx: el.offsetWidth < size ? el.offsetWidth : size) */
    function getResponsiveSize(): number {
      const containerWidth = croppieContainer!.offsetWidth;
      return containerWidth < 500 ? containerWidth : 500;
    }

    function loadImage(dataUrl: string): Promise<void> {
      if (!croppieInstance) return Promise.reject(new Error("Croppie instance not initialized"));

      return croppieInstance.bind({ url: dataUrl });
    }

    /** Create or recreate Croppie (mirrors Croppie.tsx.initial) */
    function initCroppie(dataUrl: string) {
      if (croppieInstance) {
        croppieInstance.destroy();
        croppieInstance = null;
      }

      const size = getResponsiveSize();

      croppieInstance = new Croppie(croppieContainer!, {
        viewport: { width: size, height: size },
        boundary: { width: size, height: size },
        enableOrientation: true,
        enforceBoundary: false,
        mouseWheelZoom: "ctrl",
      });

      loadImage(dataUrl);
    }

    /** Show croppie + controls, hide upload area */
    function showEditor() {
      if (croppieContainer) croppieContainer.style.display = "block";
      if (previewContainer) previewContainer.style.display = "none";
      if (controlsContainer) controlsContainer.style.display = "flex";
      if (uploadLabel) uploadLabel.style.display = "none";
    }

    /** Hide croppie + controls, show upload area */
    function showUpload() {
      if (croppieContainer) croppieContainer.style.display = "none";
      if (previewContainer) previewContainer.style.display = "flex";
      if (controlsContainer) controlsContainer.style.display = "none";
      if (uploadLabel) uploadLabel.style.display = "flex";
      if (statusMessage) {
        statusMessage.textContent = "";
        statusMessage.classList.add("twibbon-status--hidden");
      }
    }

    // ── File input handler ──
    fileInput.addEventListener("change", async (e: Event) => {
      const input = e.target as HTMLInputElement;
      const file = input.files?.[0];
      if (!file) return;

      const validation = validateImageFile(file);

      if (!validation.valid) {
        if (statusMessage) {
          statusMessage.textContent = validation.reason;
          statusMessage.classList.remove("twibbon-status--hidden");
          statusMessage.classList.add("twibbon-status--error");
        }
        return;
      }

      if (statusMessage) {
        statusMessage.textContent = "";
        statusMessage.classList.add("twibbon-status--hidden");
        statusMessage.classList.remove("twibbon-status--error");
      }

      const reader = new FileReader();
      reader.onload = (re: ProgressEvent<FileReader>) => {
        const dataUrl = re.target?.result as string;
        if (!dataUrl) return;

        showEditor();
        initCroppie(dataUrl);

        // gsap.from(croppieContainer!, {
        //   opacity: 0,
        //   scale: 0.9,
        //   duration: 0.4,
        //   ease: "power2.out",
        // });
      };

      reader.readAsDataURL(file);
    });

    // ── Download — composite via canvas (like Croppie.tsx.CropImage → drawImage → drawTwibbon) ──
    if (btnDownload) {
      btnDownload.addEventListener("click", async () => {
        if (!croppieInstance) return;

        btnDownload.classList.add("twibbon-btn--loading");
        btnDownload.setAttribute("aria-busy", "true");

        try {
          // Get cropped image at canvas resolution
          const croppedDataUrl: string = await croppieInstance.result({
            size: { width: canvas.width, height: canvas.height },
          });

          // Composite: draw cropped image → draw twibbon frame on top
          await compositeFrame(croppedDataUrl, frameSrc, canvas);

          canvas?.toBlob((blob) => {
            if (blob) {
              const url = (window.webkitURL || window.URL).createObjectURL(blob);
              const a = triggerDownload(url, `twibbon-palasma-${formatDateFilename()}.png`);
              setTimeout(() => {
                (window.webkitURL || window.URL).revokeObjectURL(url);
                document.body.removeChild(a);
              }, 200);

              if (statusMessage) {
                statusMessage.textContent = "✓ Twibbon berhasil didownload!";
                statusMessage.classList.remove("twibbon-status--hidden", "twibbon-status--error");
                statusMessage.classList.add("twibbon-status--success");
              }
            } else {
              throw new Error("Gagal membuat file untuk download");
            }
          });
        } catch {
          if (statusMessage) {
            statusMessage.textContent = "Gagal download. Coba lagi.";
            statusMessage.classList.remove("twibbon-status--hidden", "twibbon-status--success");
            statusMessage.classList.add("twibbon-status--error");
          }
        } finally {
          btnDownload.classList.remove("twibbon-btn--loading");
          btnDownload.removeAttribute("aria-busy");
        }
      });
    }

    // ── Reset (like Croppie.tsx.Reset) ──
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        if (croppieInstance) {
          croppieInstance.destroy();
          croppieInstance = null;
        }
        fileInput.value = "";
        showUpload();
      });
    }

    // initCroppie();
  }

  async function init() {
    await setupUI();
    // Add js-enabled class to activate reveal styles
    section.classList.add("js-enabled");
  }

  // If page was already loaded or GSAP/splash event isn't needed, run it immediately or on DOMContentLoaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return () => {
    document.removeEventListener("DOMContentLoaded", init);
    cleanupFns.forEach((fn) => fn());
  };
}
