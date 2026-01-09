/**
 * FontSelector Types and Constants
 */

import type { ExtendedFontItem } from "@/lib/fontProviders";

export type FontProviderType =
  | "google"
  | "adobe"
  | "fontSquirrel"
  | "custom"
  | "fontSource"
  | "openFoundry"
  | "all";

export interface FontFilterState {
  category: string;
  weight: string;
  style: string;
}

export interface FontCategory {
  value: string;
  label: string;
}

export interface FontWeight {
  value: string;
  label: string;
}

export interface FontStyle {
  value: string;
  label: string;
}

export const FONT_CATEGORIES: FontCategory[] = [
  { value: "all", label: "All Categories" },
  { value: "serif", label: "Serif" },
  { value: "sans-serif", label: "Sans Serif" },
  { value: "monospace", label: "Monospace" },
  { value: "display", label: "Display" },
  { value: "handwriting", label: "Handwriting" },
  { value: "script", label: "Script" },
  { value: "decorative", label: "Decorative" },
  { value: "slab-serif", label: "Slab Serif" },
  { value: "blackletter", label: "Blackletter" },
];

export const FONT_WEIGHTS: FontWeight[] = [
  { value: "all", label: "All Weights" },
  { value: "thin", label: "Thin" },
  { value: "light", label: "Light" },
  { value: "regular", label: "Regular" },
  { value: "medium", label: "Medium" },
  { value: "semibold", label: "Semibold" },
  { value: "bold", label: "Bold" },
  { value: "extrabold", label: "Extra Bold" },
  { value: "black", label: "Black" },
];

export const FONT_STYLES: FontStyle[] = [
  { value: "all", label: "All Styles" },
  { value: "normal", label: "Normal" },
  { value: "italic", label: "Italic" },
];

export const PROVIDER_NAMES: Record<string, string> = {
  google: "Google Fonts",
  adobe: "Adobe Fonts",
  fontSquirrel: "Font Squirrel",
  custom: "Custom Fonts",
  fontSource: "Fontsource",
  openFoundry: "Open Foundry",
  all: "All Fonts",
};

export const CATEGORY_MAPPINGS: Record<string, string[]> = {
  serif: [
    "serif",
    "oldstyle",
    "transitional",
    "didone",
    "slab serif",
    "clarendon",
    "slab-serif",
    "antique",
  ],
  "sans-serif": [
    "sans-serif",
    "sans serif",
    "grotesque",
    "neo-grotesque",
    "geometric",
    "humanist",
  ],
  monospace: [
    "monospace",
    "mono",
    "fixed-width",
    "code",
    "console",
    "typewriter",
  ],
  display: [
    "display",
    "decorative",
    "fancy",
    "title",
    "poster",
    "headline",
    "wood type",
  ],
  handwriting: [
    "handwriting",
    "script",
    "hand",
    "brush",
    "calligraphy",
    "cursive",
  ],
  script: ["script", "brush script", "calligraphy", "handwritten"],
  decorative: ["decorative", "display", "fancy", "ornamental", "novelty"],
  "slab-serif": [
    "slab-serif",
    "slab serif",
    "egyptian",
    "clarendon",
    "mechanical",
  ],
  blackletter: [
    "blackletter",
    "gothic",
    "old english",
    "fraktur",
    "textura",
  ],
};

export const WEIGHT_VARIANT_MAP: Record<string, string[]> = {
  thin: ["100", "200", "thin", "extralight", "hairline", "ultra-thin"],
  light: ["300", "light"],
  regular: ["400", "regular", "normal", "book", "text", "roman"],
  medium: ["500", "medium"],
  semibold: ["600", "semibold", "demibold", "semi-bold", "demi-bold"],
  bold: ["700", "bold", "strong"],
  extrabold: ["800", "extrabold", "extra-bold", "ultra-bold", "heavy"],
  black: ["900", "black", "heavy", "ultra", "ultra-black", "fat", "poster"],
};

export const STYLE_VARIANT_MAP: Record<string, string[]> = {
  normal: ["normal", "regular", "roman", "upright"],
  italic: ["italic", "oblique", "slanted"],
};

export const FONTS_PER_PAGE = 20;
