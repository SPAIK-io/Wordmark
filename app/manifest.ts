import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    short_name: "SPAIK",
    name: "SPAIK Logomaker",
    description:
      "Create consistent logos for SPAIK tools and products. Internal branding tool with export presets for marketing, sales, and product launches.",
    icons: [
      {
        src: "/icons/spaik-icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/icons/spaik-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/spaik-icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: "/icons/spaik-icon-64x64.png",
        sizes: "64x64",
        type: "image/png",
      },
      {
        src: "/icons/spaik-icon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/icons/spaik-icon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    id: "/?source=pwa",
    start_url: "/?source=pwa",
    display: "fullscreen",
    background_color: "#ffffff",
    theme_color: "#ff7150",
    lang: "en",
    dir: "ltr",
    scope: "/",
    prefer_related_applications: false,
    related_applications: [],
    categories: [
      "productivity",
      "utilities",
      "tools",
      "design",
      "graphics",
      "branding",
    ],
  };
}
