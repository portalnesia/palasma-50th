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
    {
      src: "/assets/images/gallery/1.jpeg",
      caption: "Momen kebersamaan di tengah petualangan alam bebas.",
    },
    {
      src: "/assets/images/gallery/2.jpeg",
      caption: "Menembus batas, menapaki puncak-puncak tertinggi.",
    },
    { src: "/assets/images/gallery/3.jpeg", caption: "" },
    { src: "/assets/images/gallery/4.jpeg", caption: "" },
    { src: "/assets/images/gallery/5.jpeg", caption: "" },
    { src: "/assets/images/gallery/6.jpeg", caption: "" },
    { src: "/assets/images/gallery/7.jpeg", caption: "" },
  ].map((item) => ({ ...item, src: getAssetUrl(item.src) })),
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
