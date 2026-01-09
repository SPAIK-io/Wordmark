import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  FONT_WEIGHT_VARIANTS,
  FONT_STYLE_VARIANTS,
  FONT_CATEGORIES,
  TOLERANCES,
} from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Debounces a function to prevent excessive calls
 * @param fn Function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Font variant utilities

/**
 * Normalizes a font weight variant to a standard weight name
 */
export function normalizeWeight(variant: string): string {
  const lowerVariant = variant.toLowerCase();
  for (const [weight, aliases] of Object.entries(FONT_WEIGHT_VARIANTS)) {
    if (aliases.some((alias) => lowerVariant.includes(alias))) {
      return weight;
    }
  }
  return "regular";
}

/**
 * Normalizes a font style variant to 'normal' or 'italic'
 */
export function normalizeStyle(variant: string): "normal" | "italic" {
  const lowerVariant = variant.toLowerCase();
  for (const [style, aliases] of Object.entries(FONT_STYLE_VARIANTS)) {
    if (aliases.some((alias) => lowerVariant.includes(alias))) {
      return style as "normal" | "italic";
    }
  }
  return "normal";
}

/**
 * Converts a weight name to its numeric CSS value
 */
export function getWeightValue(weight: string): string {
  const weightMap: Record<string, string> = {
    thin: "100",
    extralight: "200",
    light: "300",
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  };
  return weightMap[weight] || "400";
}

/**
 * Checks if a variant matches a target weight
 */
export function matchesWeight(variant: string, targetWeight: string): boolean {
  const normalizedVariant = normalizeWeight(variant);
  return normalizedVariant === targetWeight;
}

/**
 * Checks if a variant matches a target style
 */
export function matchesStyle(variant: string, targetStyle: string): boolean {
  const normalizedVariant = normalizeStyle(variant);
  return normalizedVariant === targetStyle;
}

// Font category utilities

/**
 * Normalizes a font category to a standard category name
 */
export function normalizeCategory(category: string): string {
  const lower = category.toLowerCase();
  for (const [standardCategory, aliases] of Object.entries(FONT_CATEGORIES)) {
    if (aliases.some((alias) => lower.includes(alias))) {
      return standardCategory;
    }
  }
  return category;
}

/**
 * Checks if a font's category matches a target category
 */
export function matchesCategory(
  fontCategory: string | undefined,
  targetCategory: string,
): boolean {
  if (!fontCategory) return false;
  return normalizeCategory(fontCategory) === targetCategory;
}

// Aspect ratio utilities

/**
 * Checks if two aspect ratios match within a tolerance
 */
export function matchesAspectRatio(
  currentRatio: number,
  targetRatio: number,
  tolerance = TOLERANCES.ASPECT_RATIO,
): boolean {
  return Math.abs(currentRatio - targetRatio) < tolerance;
}

/**
 * Finds a preset that matches the given aspect ratio
 */
export function findMatchingPreset<T extends { ratio: number }>(
  currentRatio: number,
  presets: T[],
  tolerance = TOLERANCES.ASPECT_RATIO,
): T | undefined {
  return presets.find((preset) =>
    matchesAspectRatio(currentRatio, preset.ratio, tolerance),
  );
}
