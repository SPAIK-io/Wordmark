/**
 * Color Palette Utilities
 * Managing saved colors and color palette operations
 */

import type { IColor } from "react-color-palette";
import type { SavedColor } from "./statemanager";
import { createColorFromHex } from "./colorUtils";

// ============================================
// Color ID Generation
// ============================================

/**
 * Generate a unique ID for a saved color
 */
export function generateColorId(): string {
  return `color_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// Color Palette Operations
// ============================================

/**
 * Create a new saved color entry
 */
export function createSavedColor(
  color: IColor,
  name?: string
): SavedColor {
  return {
    id: generateColorId(),
    color,
    name,
    createdAt: Date.now(),
  };
}

/**
 * Add a color to the palette (immutable)
 */
export function addColorToPalette(
  palette: SavedColor[],
  color: IColor,
  name?: string
): SavedColor[] {
  const savedColor = createSavedColor(color, name);
  return [...palette, savedColor];
}

/**
 * Remove a color from the palette by ID (immutable)
 */
export function removeColorFromPalette(
  palette: SavedColor[],
  colorId: string
): SavedColor[] {
  return palette.filter((c) => c.id !== colorId);
}

/**
 * Update a color's name in the palette (immutable)
 */
export function updateColorName(
  palette: SavedColor[],
  colorId: string,
  name: string
): SavedColor[] {
  return palette.map((c) =>
    c.id === colorId ? { ...c, name } : c
  );
}

/**
 * Check if a color already exists in the palette (by hex)
 */
export function colorExistsInPalette(
  palette: SavedColor[],
  hex: string
): boolean {
  const normalizedHex = hex.toLowerCase();
  return palette.some((c) => c.color.hex.toLowerCase() === normalizedHex);
}

/**
 * Find a color in the palette by hex
 */
export function findColorByHex(
  palette: SavedColor[],
  hex: string
): SavedColor | undefined {
  const normalizedHex = hex.toLowerCase();
  return palette.find((c) => c.color.hex.toLowerCase() === normalizedHex);
}

// ============================================
// Recent Colors Management
// ============================================

const MAX_RECENT_COLORS = 10;

/**
 * Add a color to recent colors list (immutable)
 * Most recent color is first, duplicates are removed
 */
export function addToRecentColors(
  recentColors: IColor[],
  color: IColor
): IColor[] {
  // Remove existing instance of this color
  const filtered = recentColors.filter(
    (c) => c.hex.toLowerCase() !== color.hex.toLowerCase()
  );

  // Add to front and limit size
  return [color, ...filtered].slice(0, MAX_RECENT_COLORS);
}

// ============================================
// Brand Colors Presets
// ============================================

export interface BrandColorPreset {
  id: string;
  name: string;
  colors: { hex: string; name: string }[];
}

/**
 * SPAIK brand colors preset
 */
export const SPAIK_BRAND_COLORS: BrandColorPreset = {
  id: "spaik",
  name: "SPAIK",
  colors: [
    { hex: "#000000", name: "Black" },
    { hex: "#ffffff", name: "White" },
    { hex: "#ff7150", name: "Coral" },
    { hex: "#4A90D9", name: "Blue" },
    { hex: "#2ECC71", name: "Green" },
    { hex: "#9B59B6", name: "Purple" },
  ],
};

/**
 * Popular color palettes for inspiration
 */
export const COLOR_PRESETS: BrandColorPreset[] = [
  SPAIK_BRAND_COLORS,
  {
    id: "monochrome",
    name: "Monochrome",
    colors: [
      { hex: "#000000", name: "Black" },
      { hex: "#333333", name: "Dark Gray" },
      { hex: "#666666", name: "Gray" },
      { hex: "#999999", name: "Light Gray" },
      { hex: "#CCCCCC", name: "Silver" },
      { hex: "#FFFFFF", name: "White" },
    ],
  },
  {
    id: "ocean",
    name: "Ocean",
    colors: [
      { hex: "#006994", name: "Sea Blue" },
      { hex: "#40E0D0", name: "Turquoise" },
      { hex: "#00CED1", name: "Dark Turquoise" },
      { hex: "#20B2AA", name: "Light Sea Green" },
      { hex: "#5F9EA0", name: "Cadet Blue" },
      { hex: "#4682B4", name: "Steel Blue" },
    ],
  },
  {
    id: "sunset",
    name: "Sunset",
    colors: [
      { hex: "#FF6B35", name: "Orange" },
      { hex: "#F7C59F", name: "Peach" },
      { hex: "#EFEFD0", name: "Cream" },
      { hex: "#FF4E50", name: "Coral Red" },
      { hex: "#FC913A", name: "Tangerine" },
      { hex: "#F9D423", name: "Golden" },
    ],
  },
  {
    id: "forest",
    name: "Forest",
    colors: [
      { hex: "#228B22", name: "Forest Green" },
      { hex: "#355E3B", name: "Hunter Green" },
      { hex: "#4F7942", name: "Fern" },
      { hex: "#8FBC8F", name: "Dark Sea Green" },
      { hex: "#90EE90", name: "Light Green" },
      { hex: "#2E8B57", name: "Sea Green" },
    ],
  },
];

/**
 * Import colors from a preset into the palette
 */
export function importPresetColors(preset: BrandColorPreset): SavedColor[] {
  return preset.colors.map(({ hex, name }) =>
    createSavedColor(createColorFromHex(hex), name)
  );
}

// ============================================
// Color Export/Import
// ============================================

/**
 * Export palette as JSON string
 */
export function exportPaletteAsJson(palette: SavedColor[]): string {
  const exportData = palette.map((c) => ({
    hex: c.color.hex,
    name: c.name || null,
  }));
  return JSON.stringify(exportData, null, 2);
}

/**
 * Import palette from JSON string
 */
export function importPaletteFromJson(json: string): SavedColor[] {
  try {
    const data = JSON.parse(json) as { hex: string; name?: string }[];
    return data.map(({ hex, name }) =>
      createSavedColor(createColorFromHex(hex), name)
    );
  } catch {
    throw new Error("Invalid palette JSON format");
  }
}

/**
 * Export palette as CSS variables
 */
export function exportPaletteAsCss(palette: SavedColor[]): string {
  const lines = palette.map((c, i) => {
    const varName = c.name
      ? `--color-${c.name.toLowerCase().replace(/\s+/g, "-")}`
      : `--color-${i + 1}`;
    return `  ${varName}: ${c.color.hex};`;
  });

  return `:root {\n${lines.join("\n")}\n}`;
}

/**
 * Export palette as Tailwind config colors
 */
export function exportPaletteAsTailwind(palette: SavedColor[]): string {
  const colors: Record<string, string> = {};

  palette.forEach((c, i) => {
    const key = c.name
      ? c.name.toLowerCase().replace(/\s+/g, "-")
      : `color-${i + 1}`;
    colors[key] = c.color.hex;
  });

  return `// Add to tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: ${JSON.stringify(colors, null, 8).replace(/"/g, "'")}\n    }\n  }\n}`;
}
