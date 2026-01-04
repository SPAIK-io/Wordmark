import { FontItem } from "@/lib/fonts";

/**
 * Custom local font integration
 */

export interface CustomFontItem extends FontItem {
  provider: "custom";
  fontFace?: FontFaceInit[];
}

export interface FontFaceInit {
  family: string;
  style?: "normal" | "italic" | "oblique";
  weight?: string;
  display?: "auto" | "block" | "swap" | "fallback" | "optional";
  unicodeRange?: string;
  stretch?:
    | "normal"
    | "ultra-condensed"
    | "extra-condensed"
    | "condensed"
    | "semi-condensed"
    | "semi-expanded"
    | "expanded"
    | "extra-expanded"
    | "ultra-expanded";
  src: string;
}

export const loadCustomFonts = () => {
  if (typeof window === "undefined") return null;

  // Loop through custom fonts and create @font-face with FontFace API
  customFontList.forEach((font) => {
    if (font.fontFace) {
      font.fontFace.forEach((faceInit) => {
        const fontFace = new FontFace(faceInit.family, `url(${faceInit.src})`, {
          style: faceInit.style || "normal",
          weight: faceInit.weight || "normal",
          display: faceInit.display || "auto",
          unicodeRange: faceInit.unicodeRange,
          stretch: faceInit.stretch,
        });

        // Load the font
        fontFace
          .load()
          .then((loadedFace) => {
            document.fonts.add(loadedFace);
          })
          .catch((err) => {
            console.error(`Failed to load font: ${faceInit.family}`, err);
          });
      });
    }
  });

  return null;
};

// SPAIK brand fonts for internal branding consistency
export const customFontList: CustomFontItem[] = [
  {
    family: "Ivy Presto Headline",
    variants: ["100"],
    subsets: ["latin"],
    version: "1.0",
    lastModified: "2025-01-04",
    files: {
      regular: "/fonts/spaik/IvyPrestoHeadline-Thin.otf",
    },
    category: "serif",
    kind: "webfont",
    menu: "serif",
    provider: "custom",
    fontFace: [
      {
        family: "Ivy Presto Headline",
        style: "normal",
        weight: "100",
        display: "swap",
        src: "/fonts/spaik/IvyPrestoHeadline-Thin.otf",
      },
    ],
  },
  {
    family: "PP Agrandir Tight",
    variants: ["regular", "500", "bold"],
    subsets: ["latin"],
    version: "1.0",
    lastModified: "2025-01-04",
    files: {
      regular: "/fonts/spaik/PPAgrandir-TightRegular.ttf",
      bold: "/fonts/spaik/PPAgrandir-TightBold.ttf",
    },
    category: "sans-serif",
    kind: "webfont",
    menu: "sans-serif",
    provider: "custom",
    fontFace: [
      {
        family: "PP Agrandir Tight",
        style: "normal",
        weight: "400",
        display: "swap",
        src: "/fonts/spaik/PPAgrandir-TightRegular.ttf",
      },
      {
        family: "PP Agrandir Tight",
        style: "normal",
        weight: "500",
        display: "swap",
        src: "/fonts/spaik/PPAgrandir-TightMedium.ttf",
      },
      {
        family: "PP Agrandir Tight",
        style: "normal",
        weight: "700",
        display: "swap",
        src: "/fonts/spaik/PPAgrandir-TightBold.ttf",
      },
    ],
  },
  {
    family: "SF Pro Text",
    variants: ["regular", "500", "bold"],
    subsets: ["latin"],
    version: "1.0",
    lastModified: "2025-01-04",
    files: {
      regular: "/fonts/spaik/SFProText-Regular.otf",
      bold: "/fonts/spaik/SFProText-Bold.otf",
    },
    category: "sans-serif",
    kind: "webfont",
    menu: "sans-serif",
    provider: "custom",
    fontFace: [
      {
        family: "SF Pro Text",
        style: "normal",
        weight: "400",
        display: "swap",
        src: "/fonts/spaik/SFProText-Regular.otf",
      },
      {
        family: "SF Pro Text",
        style: "normal",
        weight: "500",
        display: "swap",
        src: "/fonts/spaik/SFProText-Medium.otf",
      },
      {
        family: "SF Pro Text",
        style: "normal",
        weight: "700",
        display: "swap",
        src: "/fonts/spaik/SFProText-Bold.otf",
      },
    ],
  },
];
