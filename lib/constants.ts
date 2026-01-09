// Layout types for logo arrangement
const LAYOUT_TYPES = [
  "ltr",
  "rtl",
  "ttd",
  "dtt",
  "text",
  "icon",
  "circle",
] as const;

// CSS units for dimension inputs
const Units = [
  "px",
  "%",
  "em",
  "rem",
  "vh",
  "vw",
  "vmin",
  "vmax",
  "ex",
  "ch",
  "cm",
  "mm",
  "in",
  "pt",
  "pc",
  "dvw",
  "dvh",
  "svw",
  "svh",
  "lvw",
  "lvh",
  "vb",
  "vi",
] as const;

// API endpoints for font providers
export const API_ENDPOINTS = {
  FONTSOURCE: "https://api.fontsource.org/v1/fonts",
  OPEN_FOUNDRY_DATA: "https://open-foundry.com/data/sheet.json",
  OPEN_FOUNDRY_CSS: "https://open-foundry.com/data/fonts.css",
  OPEN_FOUNDRY_PROXY: "/api/fonts/openFoundry",
  FONT_SQUIRREL_CLASSIFICATIONS: "https://www.fontsquirrel.com/api/classifications",
  FONT_SQUIRREL_FAMILIES: "https://www.fontsquirrel.com/api/fontlist/all",
  GOOGLE_FONTS_CSS: "https://fonts.googleapis.com/css2",
} as const;

// Cache durations
export const CACHE_DURATIONS = {
  FONT_CACHE_MS: 60 * 60 * 1000, // 1 hour in milliseconds
  FONT_CACHE_SECONDS: 3600, // 1 hour in seconds (for Next.js revalidate)
  FONT_CACHE_LONG_SECONDS: 31536000, // 1 year in seconds
} as const;

// Timing delays (milliseconds)
export const DELAYS = {
  IMMEDIATE: 0,
  SCROLL_DEBOUNCE: 50,
  FONT_LOAD_INITIAL: 100,
  FONT_LOAD_SECONDARY: 200,
  FONT_PROVIDER_INIT: 300,
  FONT_SQUIRREL_DELAY: 500,
  IDLE_CALLBACK_TIMEOUT: 2000,
} as const;

// Batch sizes for processing
export const BATCH_SIZES = {
  FONT_PROCESSING: 200,
  FONT_LOADING: 5,
  FONT_CHUNK: 30,
  MAX_CONCURRENT_REQUESTS: 6,
} as const;

// UI tolerances
export const TOLERANCES = {
  ASPECT_RATIO: 0.01,
} as const;

// Default UI values
export const DEFAULTS = {
  TEXT_SIZE: 24,
  LINE_HEIGHT: 1.2,
  ICON_SIZE: 32,
  CARD_WIDTH: 400,
  CARD_HEIGHT: 225,
  MAX_HISTORY_SIZE: 50,
} as const;

// Font weight variant mappings
export const FONT_WEIGHT_VARIANTS: Record<string, string[]> = {
  thin: ["100", "200", "thin", "extralight", "hairline", "ultra-thin"],
  light: ["300", "light"],
  regular: ["400", "regular", "normal", "book", "text", "roman"],
  medium: ["500", "medium"],
  semibold: ["600", "semibold", "demi", "demibold"],
  bold: ["700", "bold"],
  extrabold: ["800", "extrabold", "ultrabold", "extra-bold", "ultra-bold"],
  black: ["900", "black", "heavy"],
};

// Font style variant mappings
export const FONT_STYLE_VARIANTS: Record<string, string[]> = {
  normal: ["normal", "regular", "roman", "upright"],
  italic: ["italic", "oblique", "slanted"],
};

// Font category mappings
export const FONT_CATEGORIES: Record<string, string[]> = {
  "sans-serif": ["sans", "sans-serif", "gothic", "grotesque", "grotesk"],
  serif: ["serif", "roman", "antiqua"],
  monospace: ["mono", "monospace", "code", "typewriter", "fixed"],
  display: ["display", "decorative", "headline", "poster", "ornamental"],
  handwriting: ["hand", "handwriting", "script", "cursive", "calligraphy", "brush"],
};

// localStorage keys
export const STORAGE_KEYS = {
  AI_ICONS: "wordmark-ai-icons",
  EXPORT_PREFERENCES: "wordmark-export-preferences",
  COLOR_PALETTE: "wordmark-color-palette",
  VERSION_HISTORY: "wordmark_version_history",
  CARD_STATE: "wordmark_card_state",
  TEXT_STATE: "wordmark_text_state",
  FONT_PREFERENCES: "wordmark_font_preferences",
} as const;

export { LAYOUT_TYPES, Units };
