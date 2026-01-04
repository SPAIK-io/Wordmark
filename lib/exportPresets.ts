import type { DownloadFormat } from "@/app/DownloadButton";

type PresetCategory = "internal-tools" | "micro-saas" | "social" | "print";

interface ExportPreset {
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

export const EXPORT_PRESETS = [
  // Internal Tools
  {
    id: "favicon",
    name: "Favicon",
    category: "internal-tools",
    dimensions: { width: 32, height: 32 },
    formats: ["png"],
  },
  {
    id: "app-icon",
    name: "App Icon",
    category: "internal-tools",
    dimensions: { width: 512, height: 512 },
    formats: ["png"],
  },
  {
    id: "sidebar-logo",
    name: "Sidebar Logo",
    category: "internal-tools",
    dimensions: { width: 120, height: 40 },
    formats: ["png", "svg"],
  },

  // Micro-SaaS
  {
    id: "og-image",
    name: "OG Image",
    category: "micro-saas",
    dimensions: { width: 1200, height: 630 },
    formats: ["png"],
  },
  {
    id: "twitter-card",
    name: "Twitter Card",
    category: "micro-saas",
    dimensions: { width: 1200, height: 600 },
    formats: ["png"],
  },
  {
    id: "email-header",
    name: "Email Header",
    category: "micro-saas",
    dimensions: { width: 600, height: 150 },
    formats: ["png"],
  },

  // Social
  {
    id: "instagram",
    name: "Instagram Post",
    category: "social",
    dimensions: { width: 1080, height: 1080 },
    formats: ["png"],
  },
  {
    id: "linkedin-banner",
    name: "LinkedIn Banner",
    category: "social",
    dimensions: { width: 1128, height: 191 },
    formats: ["png"],
  },

  // Print
  {
    id: "business-card",
    name: "Business Card",
    category: "print",
    dimensions: { width: 1050, height: 600 },
    formats: ["png", "svg"],
  },
] as const satisfies readonly ExportPreset[];

export type PresetId = (typeof EXPORT_PRESETS)[number]["id"];
export type { ExportPreset, PresetCategory };

export const PRESET_CATEGORIES: Record<PresetCategory, string> = {
  "internal-tools": "Internal Tools",
  "micro-saas": "Micro-SaaS",
  social: "Social Media",
  print: "Print",
};

export function getPresetById(id: PresetId): ExportPreset | undefined {
  return EXPORT_PRESETS.find((p) => p.id === id);
}

export function getPresetsByCategory(category: PresetCategory): ExportPreset[] {
  return EXPORT_PRESETS.filter((p) => p.category === category);
}
