import type { IColor } from "react-color-palette";

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

// SPAIK brand colors as IColor
export const SPAIK_COLORS = {
  accent: hexToIColor("#ff7150"),
  black: hexToIColor("#000000"),
  white: hexToIColor("#ffffff"),
  clay400: hexToIColor("#dedccc"),
  blue400: hexToIColor("#a2bdf0"),
  lilac400: hexToIColor("#e1d2ff"),
} as const;
