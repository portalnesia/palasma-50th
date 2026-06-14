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
      src: "/assets/images/gallery/1.jpg",
      caption: "Pendakian Gunung Rinjani, 2013",
    },
    {
      src: "/assets/images/gallery/2.jpeg",
      caption: "Pendakian Gunung Agung, 2014",
    },
    {
      src: "/assets/images/gallery/3.jpg",
      caption: "Pendakikan Puncak Cartenz, 2015",
      style: { objectPosition: "top" },
    },
    { src: "/assets/images/gallery/4.jpg", caption: "Gathering PALASMA, 2022" },
    { src: "/assets/images/gallery/5.jpg", caption: "Pendakian Gunung Tambora, 2013" },
  ].map((item) => ({ ...item, src: getAssetUrl(item.src) })),
  bgMusic: getAssetUrl("/assets/audio/forever-young.mp3"),
  mountains: getAssetUrl("/assets/images/mountains.png"),
};
