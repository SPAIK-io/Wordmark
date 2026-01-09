import type { DownloadFormat } from "@/lib/types/design";

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
  readonly description?: string;
}

export const EXPORT_PRESETS = [
  // Internal Tools - Favicons & Icons
  {
    id: "favicon-16",
    name: "Favicon 16×16",
    category: "internal-tools",
    dimensions: { width: 16, height: 16 },
    formats: ["png"],
    description: "Smallest favicon size for browser tabs",
  },
  {
    id: "favicon-32",
    name: "Favicon 32×32",
    category: "internal-tools",
    dimensions: { width: 32, height: 32 },
    formats: ["png"],
    description: "Standard favicon size",
  },
  {
    id: "favicon-48",
    name: "Favicon 48×48",
    category: "internal-tools",
    dimensions: { width: 48, height: 48 },
    formats: ["png"],
    description: "Windows site icon",
  },
  {
    id: "favicon-192",
    name: "Android Chrome 192×192",
    category: "internal-tools",
    dimensions: { width: 192, height: 192 },
    formats: ["png"],
    description: "Android home screen icon",
  },
  {
    id: "favicon-512",
    name: "Android Chrome 512×512",
    category: "internal-tools",
    dimensions: { width: 512, height: 512 },
    formats: ["png"],
    description: "Large Android icon for PWA",
  },
  {
    id: "apple-touch-icon",
    name: "Apple Touch Icon 180×180",
    category: "internal-tools",
    dimensions: { width: 180, height: 180 },
    formats: ["png"],
    description: "iOS home screen icon",
  },
  {
    id: "app-icon",
    name: "App Icon 1024×1024",
    category: "internal-tools",
    dimensions: { width: 1024, height: 1024 },
    formats: ["png"],
    description: "High-res app store icon",
  },
  {
    id: "sidebar-logo",
    name: "Sidebar Logo",
    category: "internal-tools",
    dimensions: { width: 120, height: 40 },
    formats: ["png", "svg"],
    description: "Navigation sidebar logo",
  },
  {
    id: "header-logo",
    name: "Header Logo",
    category: "internal-tools",
    dimensions: { width: 200, height: 50 },
    formats: ["png", "svg"],
    description: "Main header/navbar logo",
  },
  {
    id: "footer-logo",
    name: "Footer Logo",
    category: "internal-tools",
    dimensions: { width: 150, height: 40 },
    formats: ["png", "svg"],
    description: "Footer section logo",
  },
  {
    id: "login-logo",
    name: "Login Page Logo",
    category: "internal-tools",
    dimensions: { width: 280, height: 80 },
    formats: ["png", "svg"],
    description: "Login/authentication page logo",
  },

  // Micro-SaaS - Marketing & Web
  {
    id: "og-image",
    name: "Open Graph Image",
    category: "micro-saas",
    dimensions: { width: 1200, height: 630 },
    formats: ["png"],
    description: "Social share preview image",
  },
  {
    id: "twitter-card",
    name: "Twitter Card",
    category: "micro-saas",
    dimensions: { width: 1200, height: 600 },
    formats: ["png"],
    description: "Twitter share preview",
  },
  {
    id: "twitter-card-large",
    name: "Twitter Card (Large)",
    category: "micro-saas",
    dimensions: { width: 1500, height: 500 },
    formats: ["png"],
    description: "Twitter profile header",
  },
  {
    id: "email-header",
    name: "Email Header",
    category: "micro-saas",
    dimensions: { width: 600, height: 150 },
    formats: ["png"],
    description: "Email newsletter header",
  },
  {
    id: "email-signature",
    name: "Email Signature",
    category: "micro-saas",
    dimensions: { width: 300, height: 80 },
    formats: ["png"],
    description: "Email signature logo",
  },
  {
    id: "hero-logo",
    name: "Hero Section Logo",
    category: "micro-saas",
    dimensions: { width: 400, height: 120 },
    formats: ["png", "svg"],
    description: "Landing page hero logo",
  },
  {
    id: "watermark",
    name: "Watermark",
    category: "micro-saas",
    dimensions: { width: 200, height: 60 },
    formats: ["png"],
    description: "Document/image watermark",
  },
  {
    id: "docs-logo",
    name: "Documentation Logo",
    category: "micro-saas",
    dimensions: { width: 180, height: 50 },
    formats: ["png", "svg"],
    description: "Documentation site logo",
  },

  // Social Media
  {
    id: "instagram-post",
    name: "Instagram Post",
    category: "social",
    dimensions: { width: 1080, height: 1080 },
    formats: ["png"],
    description: "Square Instagram post",
  },
  {
    id: "instagram-story",
    name: "Instagram Story",
    category: "social",
    dimensions: { width: 1080, height: 1920 },
    formats: ["png"],
    description: "Vertical Instagram story",
  },
  {
    id: "linkedin-banner",
    name: "LinkedIn Banner",
    category: "social",
    dimensions: { width: 1128, height: 191 },
    formats: ["png"],
    description: "LinkedIn profile background",
  },
  {
    id: "linkedin-company",
    name: "LinkedIn Company Logo",
    category: "social",
    dimensions: { width: 300, height: 300 },
    formats: ["png"],
    description: "LinkedIn company page logo",
  },
  {
    id: "youtube-thumbnail",
    name: "YouTube Thumbnail",
    category: "social",
    dimensions: { width: 1280, height: 720 },
    formats: ["png"],
    description: "YouTube video thumbnail",
  },
  {
    id: "youtube-channel",
    name: "YouTube Channel Art",
    category: "social",
    dimensions: { width: 2560, height: 1440 },
    formats: ["png"],
    description: "YouTube channel banner",
  },
  {
    id: "facebook-profile",
    name: "Facebook Profile",
    category: "social",
    dimensions: { width: 170, height: 170 },
    formats: ["png"],
    description: "Facebook profile picture",
  },
  {
    id: "facebook-cover",
    name: "Facebook Cover",
    category: "social",
    dimensions: { width: 820, height: 312 },
    formats: ["png"],
    description: "Facebook cover photo",
  },
  {
    id: "pinterest-pin",
    name: "Pinterest Pin",
    category: "social",
    dimensions: { width: 1000, height: 1500 },
    formats: ["png"],
    description: "Vertical Pinterest pin",
  },

  // Print Materials
  {
    id: "business-card",
    name: "Business Card",
    category: "print",
    dimensions: { width: 1050, height: 600 },
    formats: ["png", "svg"],
    description: "Standard business card (3.5×2 in @ 300dpi)",
  },
  {
    id: "letterhead",
    name: "Letterhead Logo",
    category: "print",
    dimensions: { width: 600, height: 180 },
    formats: ["png", "svg"],
    description: "Letterhead/document header",
  },
  {
    id: "envelope",
    name: "Envelope Logo",
    category: "print",
    dimensions: { width: 400, height: 120 },
    formats: ["png", "svg"],
    description: "Envelope corner logo",
  },
  {
    id: "sticker-circle",
    name: "Circle Sticker",
    category: "print",
    dimensions: { width: 600, height: 600 },
    formats: ["png", "svg"],
    description: "Circular sticker/badge",
  },
  {
    id: "sticker-square",
    name: "Square Sticker",
    category: "print",
    dimensions: { width: 600, height: 600 },
    formats: ["png", "svg"],
    description: "Square sticker",
  },
  {
    id: "merchandise",
    name: "Merchandise",
    category: "print",
    dimensions: { width: 2400, height: 2400 },
    formats: ["png", "svg"],
    description: "T-shirt/merchandise print",
  },
  {
    id: "poster-a4",
    name: "A4 Poster",
    category: "print",
    dimensions: { width: 2480, height: 3508 },
    formats: ["png", "svg"],
    description: "A4 poster (210×297mm @ 300dpi)",
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

export function getAllPresetIds(): PresetId[] {
  return EXPORT_PRESETS.map((p) => p.id) as PresetId[];
}

export function getPresetCount(): number {
  return EXPORT_PRESETS.length;
}

export function getPresetCountByCategory(): Record<PresetCategory, number> {
  return {
    "internal-tools": getPresetsByCategory("internal-tools").length,
    "micro-saas": getPresetsByCategory("micro-saas").length,
    social: getPresetsByCategory("social").length,
    print: getPresetsByCategory("print").length,
  };
}
