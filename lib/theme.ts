/**
 * Theme Utilities
 * Helper functions for theme management in Wordmark
 */

import type { ThemeMode } from "@/lib/types/design";

/**
 * Get the effective theme based on system preference when mode is "system"
 */
export function getEffectiveTheme(
  mode: ThemeMode,
  systemPreference: "light" | "dark"
): "light" | "dark" {
  if (mode === "system") {
    return systemPreference;
  }
  return mode;
}

/**
 * Check if the current environment supports system theme detection
 */
export function supportsSystemTheme(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia !== undefined;
}

/**
 * Get the current system color scheme preference
 */
export function getSystemThemePreference(): "light" | "dark" {
  if (!supportsSystemTheme()) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Subscribe to system theme changes
 */
export function subscribeToSystemTheme(
  callback: (theme: "light" | "dark") => void
): () => void {
  if (!supportsSystemTheme()) return () => {};

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? "dark" : "light");
  };

  mediaQuery.addEventListener("change", handler);
  return () => mediaQuery.removeEventListener("change", handler);
}

/**
 * Theme color constants for brand consistency
 */
export const THEME_COLORS = {
  light: {
    primary: "#000000",
    accent: "#ff7150",
    background: "#ffffff",
    foreground: "#0a0a0a",
    muted: "#f4f4f5",
  },
  dark: {
    primary: "#ffffff",
    accent: "#ff8a70",
    background: "#0a0a0a",
    foreground: "#fafafa",
    muted: "#27272a",
  },
} as const;

/**
 * Get theme-aware color
 */
export function getThemeColor(
  colorKey: keyof typeof THEME_COLORS.light,
  theme: "light" | "dark"
): string {
  return THEME_COLORS[theme][colorKey];
}
