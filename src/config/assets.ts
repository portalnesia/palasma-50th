// Generate a unique build version based on the timestamp when Astro builds the site.
// Since 'output: "static"' is set in astro.config.mjs, this code is evaluated during the build process,
// so the generated static HTML files will contain the same static '?v=BUILD_VERSION' query param.
const BUILD_VERSION = Date.now().toString();

export const getAssetUrl = (path: string): string => {
  if (!path) return "";
  // Check if it's already versioned or an external link
  if (
    (path.includes("?v=") || path.startsWith("http://") || path.startsWith("https://")) &&
    import.meta.env.NODE_ENV !== "production"
  ) {
    return path;
  }
  return `${path}?v=${BUILD_VERSION}`;
};

export const ASSETS = {
  logo: {
    palasma: getAssetUrl("/assets/images/logo-palasma.png"),
    "50th": getAssetUrl("/assets/images/logo-50.png"),
  },
  twibbon: {
    frame: getAssetUrl("/assets/images/twibbon.png"),
    bg_edit: getAssetUrl("/assets/images/transparent.jpg"),
  },
  gallery: [
    "/assets/images/gallery/photo-1.jpg",
    "/assets/images/gallery/photo-2.jpg",
    "/assets/images/gallery/photo-3.jpg",
    "/assets/images/gallery/photo-4.jpg",
    "/assets/images/gallery/photo-5.jpg",
    "/assets/images/gallery/photo-6.jpg",
  ].map(getAssetUrl),
  bgMusic: getAssetUrl("/assets/audio/forever-young.mp3"),
  bg: {
    1: getAssetUrl("/assets/images/bg/1.jpeg"),
    2: getAssetUrl("/assets/images/bg/2.jpeg"),
    3: getAssetUrl("/assets/images/bg/3.jpeg"),
    4: getAssetUrl("/assets/images/bg/4.jpeg"),
    5: getAssetUrl("/assets/images/bg/5.jpeg"),
    6: getAssetUrl("/assets/images/bg/6.jpeg"),
    7: getAssetUrl("/assets/images/bg/7.jpeg"),
  },
  mountains: getAssetUrl("/assets/images/mountains.png"),
};
