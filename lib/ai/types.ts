/**
 * AI-generated icon type definition
 */
export interface AIGeneratedIcon {
  /** Unique identifier for the generated icon */
  id: string;
  /** User's original prompt */
  prompt: string;
  /** Style used for generation */
  style: AIIconStyle;
  /** Raw SVG string data */
  svgData: string;
  /** Original PNG as data URL (for reference/fallback) */
  pngDataUrl?: string;
  /** Generation timestamp */
  createdAt: number;
}

/** Available style presets for logo generation */
export type AIIconStyle = "minimal" | "geometric" | "abstract" | "icon";

/** API request body for generate-logo endpoint */
export interface GenerateLogoRequest {
  prompt: string;
  style?: AIIconStyle;
}

/** API response from generate-logo endpoint */
export interface GenerateLogoResponse {
  success: boolean;
  image?: string; // base64 PNG
  error?: string;
}

/** API request body for vectorize endpoint */
export interface VectorizeRequest {
  image: string; // base64 PNG
}

/** API response from vectorize endpoint */
export interface VectorizeResponse {
  success: boolean;
  svg?: string;
  error?: string;
}

/** Generation progress states */
export type GenerationProgress =
  | "idle"
  | "generating"
  | "converting"
  | "complete";

/** State for AI icon generation */
export interface AIGenerationState {
  isLoading: boolean;
  error: string | null;
  progress: GenerationProgress;
}
