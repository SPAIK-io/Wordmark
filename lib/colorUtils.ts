/**
 * Color Utilities
 * WCAG contrast checking and color manipulation
 */

import type { IColor } from "react-color-palette";
import type { ContrastResult, WCAGLevel, WCAGSize } from "./types/design";

// ============================================
// Color Conversion Utilities
// ============================================

/**
 * Convert a hex color string to IColor object for react-color-palette
 */
export function hexToIColor(hex: string): IColor {
  // Ensure hex is properly formatted
  const cleanHex = hex.startsWith("#") ? hex : `#${hex}`;

  // Parse RGB values
  const r = parseInt(cleanHex.slice(1, 3), 16);
  const g = parseInt(cleanHex.slice(3, 5), 16);
  const b = parseInt(cleanHex.slice(5, 7), 16);

  // Convert RGB to HSV
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta) % 6;
    } else if (max === gNorm) {
      h = (bNorm - rNorm) / delta + 2;
    } else {
      h = (rNorm - gNorm) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : Math.round((delta / max) * 100);
  const v = Math.round(max * 100);

  return {
    hex: cleanHex,
    rgb: { r, g, b, a: 1 },
    hsv: { h, s, v, a: 1 },
  };
}

/** Alias for backwards compatibility */
export const createColorFromHex = hexToIColor;

/**
 * Convert hex to RGB object
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Convert RGB to hex string
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.min(255, Math.max(0, n))).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// SPAIK brand colors as IColor
export const SPAIK_COLORS = {
  accent: hexToIColor("#ff7150"),
  black: hexToIColor("#000000"),
  white: hexToIColor("#ffffff"),
  clay400: hexToIColor("#dedccc"),
  blue400: hexToIColor("#a2bdf0"),
  lilac400: hexToIColor("#e1d2ff"),
} as const;

// ============================================
// Luminance Calculation
// ============================================

/**
 * Convert sRGB value to linear RGB
 */
function sRGBtoLinear(value: number): number {
  const normalized = value / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : Math.pow((normalized + 0.055) / 1.055, 2.4);
}

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.1 definition
 */
export function getRelativeLuminance(color: IColor): number {
  const r = sRGBtoLinear(color.rgb.r);
  const g = sRGBtoLinear(color.rgb.g);
  const b = sRGBtoLinear(color.rgb.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// ============================================
// Contrast Ratio Calculation
// ============================================

/**
 * Calculate contrast ratio between two colors
 * Returns a value between 1 and 21
 */
export function getContrastRatio(color1: IColor, color2: IColor): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

// ============================================
// WCAG Compliance Checking
// ============================================

// WCAG 2.1 minimum contrast ratios
const WCAG_THRESHOLDS = {
  AA: { normal: 4.5, large: 3 },
  AAA: { normal: 7, large: 4.5 },
} as const;

/**
 * Check if a contrast ratio meets WCAG requirements
 */
export function meetsWCAG(
  ratio: number,
  level: WCAGLevel,
  size: WCAGSize
): boolean {
  return ratio >= WCAG_THRESHOLDS[level][size];
}

/**
 * Get full contrast analysis between two colors
 */
export function analyzeContrast(
  foreground: IColor,
  background: IColor
): ContrastResult {
  const ratio = getContrastRatio(foreground, background);

  const passes = {
    AA: {
      normal: meetsWCAG(ratio, "AA", "normal"),
      large: meetsWCAG(ratio, "AA", "large"),
    },
    AAA: {
      normal: meetsWCAG(ratio, "AAA", "normal"),
      large: meetsWCAG(ratio, "AAA", "large"),
    },
  };

  // Determine overall level
  let level: ContrastResult["level"] = "fail";
  if (passes.AAA.normal) {
    level = "AAA";
  } else if (passes.AA.normal) {
    level = "AA";
  }

  return {
    ratio: Math.round(ratio * 100) / 100,
    level,
    passes,
  };
}

// ============================================
// Color Suggestions
// ============================================

/**
 * Suggest a contrasting color that meets WCAG requirements
 */
export function suggestContrastingColor(
  background: IColor,
  _level: WCAGLevel = "AA",
  _size: WCAGSize = "normal"
): IColor {
  const luminance = getRelativeLuminance(background);

  // Determine if we should suggest light or dark
  // Use the midpoint of luminance range (0.1791) as threshold
  const useDark = luminance > 0.1791;

  if (useDark) {
    return SPAIK_COLORS.black;
  } else {
    return SPAIK_COLORS.white;
  }
}

// ============================================
// Contrast Rating Display
// ============================================

/**
 * Get a human-readable contrast rating
 */
export function getContrastRating(ratio: number): {
  label: string;
  emoji: string;
  description: string;
} {
  if (ratio >= 7) {
    return {
      label: "Excellent",
      emoji: "✅",
      description: "Meets AAA for all text",
    };
  }
  if (ratio >= 4.5) {
    return {
      label: "Good",
      emoji: "👍",
      description: "Meets AA for normal text, AAA for large text",
    };
  }
  if (ratio >= 3) {
    return {
      label: "Fair",
      emoji: "⚠️",
      description: "Meets AA for large text only",
    };
  }
  return {
    label: "Poor",
    emoji: "❌",
    description: "Does not meet WCAG requirements",
  };
}

/**
 * Format contrast ratio for display
 */
export function formatContrastRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}
