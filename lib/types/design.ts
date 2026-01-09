/**
 * Design System Type Definitions
 * Centralized types for the Wordmark internal branding tool
 */

import type { IColor } from "react-color-palette";
import type { LucideIconType } from "@/components/icons";

// ============================================
// Unit Types
// ============================================

export type UnitType =
  | "px"
  | "%"
  | "em"
  | "rem"
  | "vh"
  | "vw"
  | "vmin"
  | "vmax"
  | "ex"
  | "ch"
  | "cm"
  | "mm"
  | "in"
  | "pt"
  | "pc"
  | "dvw"
  | "dvh"
  | "svw"
  | "svh"
  | "lvw"
  | "lvh"
  | "vb"
  | "vi";

export interface DimensionValue {
  value: number;
  unit: UnitType;
}

// ============================================
// Text State Types
// ============================================

export type TextTransform = "none" | "uppercase" | "lowercase" | "capitalize";

export interface TextState {
  text: string;
  color: IColor;
  size: number;
  lineHeight: number;
  letterSpacing: number;
  fontWeight: string;
  textTransform: TextTransform;
}

// ============================================
// Icon State Types
// ============================================

export interface IconState {
  icon: LucideIconType;
  color: IColor;
  size: number;
}

// ============================================
// Card State Types
// ============================================

export interface CardState {
  color: IColor;
  width: DimensionValue;
  height: DimensionValue;
  ratioLocked: boolean;
}

// ============================================
// Layout Types
// ============================================

export type LayoutDirection = "ltr" | "rtl" | "ttd" | "dtt" | "text" | "icon" | "circle";

// ============================================
// Export Types
// ============================================

export type DownloadFormat = "png" | "svg" | "jpeg";

export type PresetCategory = "internal-tools" | "micro-saas" | "social" | "print";

export interface ExportPreset {
  readonly id: string;
  readonly name: string;
  readonly category: PresetCategory;
  readonly dimensions: {
    readonly width: number;
    readonly height: number;
  };
  readonly formats: readonly DownloadFormat[];
  readonly scale?: number;
}

export interface ExportOptions {
  format: DownloadFormat;
  scale: number;
  quality?: number; // For JPEG
  backgroundColor?: string;
  filename?: string;
}

export interface BatchExportItem {
  preset: ExportPreset;
  format: DownloadFormat;
}

// ============================================
// Undo/Redo Types
// ============================================

export interface DesignSnapshot {
  text: TextState;
  icon: IconState;
  card: CardState;
  layout: LayoutDirection;
  timestamp: number;
}

export interface UndoRedoState {
  past: DesignSnapshot[];
  present: DesignSnapshot;
  future: DesignSnapshot[];
}

// ============================================
// Theme Types
// ============================================

export type ThemeMode = "light" | "dark" | "system";

// ============================================
// Color Utility Types
// ============================================

export type WCAGLevel = "AA" | "AAA";
export type WCAGSize = "normal" | "large";

export interface ContrastResult {
  ratio: number;
  level: WCAGLevel | "fail";
  passes: {
    AA: { normal: boolean; large: boolean };
    AAA: { normal: boolean; large: boolean };
  };
}

// ============================================
// AI Icon Types (re-export from ai/types)
// ============================================

export interface AIGeneratedIcon {
  id: string;
  svgContent: string;
  prompt: string;
  createdAt: number;
  metadata?: {
    model?: string;
    style?: string;
  };
}

export type AIGenerationProgress = "idle" | "generating" | "processing" | "complete";

export interface AIGenerationState {
  isLoading: boolean;
  error: string | null;
  progress: AIGenerationProgress;
}
