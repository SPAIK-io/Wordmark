# feat: Transform Wordmark into SPAIK Logomaker

## Overview

Transform the forked Wordmark logo creation tool into a SPAIK-branded internal tool for creating consistent branding across internal tools and micro-SaaS products.

**Goal**: SPAIK Logomaker - internal branding tool with export presets for marketing, sales, and product launches

## Acceptance Criteria

- [ ] All "Wordmark" branding replaced with "SPAIK Logomaker"
- [ ] UI themed with SPAIK design tokens (accent color #ff7150)
- [ ] Export presets for: Internal Tools, Micro-SaaS, Social Media, Print
- [ ] PWA manifest and icons updated
- [ ] Light/dark mode uses SPAIK semantic colors
- [ ] Typography/colors remain flexible (inspired by SPAIK, not locked)
- [ ] SPAIK fonts available in font picker

---

## SPAIK Design Tokens Reference

From `SPAIK Branding/Design tokens/tokens.json`:

| Token | Value | HSL | Usage |
|-------|-------|-----|-------|
| **Accent** | `#ff7150` | `14 100% 66%` | Primary CTA, highlights |
| **Accent Hover** | `#d96044` | `14 79% 55%` | Hover states |
| **Clay.400** | `#dedccc` | `48 23% 85%` | Primary surfaces |
| **Blue.400** | `#a2bdf0` | `217 67% 79%` | Secondary |
| **Lilac.400** | `#e1d2ff` | `262 100% 91%` | Warning/destructive |
| **Spacing** | xs(4), sm(8), md(16), lg(24), xl(32) | - | Layout |
| **Radius** | sm(2), md(4), lg(8) | - | Border radius |

**Fonts** (licensed): Ivy Presto Headline (h1), Agrandir Variable (h2), SF Pro (body)

---

## Implementation Phases

### Phase 1: Branding Updates (Foundation)

**Files to modify:**

1. **`app/layout.tsx`** (lines 10-46) - Metadata
   ```typescript
   title: "SPAIK Logomaker"
   description: "Create consistent logos for SPAIK tools and products"
   applicationName: "SPAIK Logomaker"
   creator: "SPAIK"
   themeColor: "#ff7150"
   ```

2. **`app/manifest.ts`** (lines 3-62) - PWA config
   ```typescript
   short_name: "SPAIK"
   name: "SPAIK Logomaker"
   theme_color: "#ff7150"
   // Update icon paths to spaik-icon-*.png
   ```

3. **`app/page.tsx`** (lines 89, 193) - Header branding
   - Replace "Wordmark." with "SPAIK."
   - Update creator links to SPAIK

4. **`app/Credits.tsx`** (lines 25-69) - Footer
   - Update GitHub link and creator attribution

5. **`public/`** - Replace all image assets
   - `favicon.ico` → SPAIK favicon
   - `Wordmark.png`, `Wordmark-Light.png`, `Wordmark-Dark.png` → SPAIK OG images
   - `icons/wordmark-icon-*.png` → `spaik-icon-*.png` (16, 32, 64, 128, 192, 256)
   - `wordmark-icon.png`, `wordmark-icon-large.png` → SPAIK versions
   - `images/` folder - update duplicates

### Phase 2: UI Theming

**Architecture**: CSS variables as single source of truth. No hardcoded hex values in components.

**Files to modify:**

1. **`app/globals.css`** (lines 6-50) - CSS variables (light + dark mode)
   ```css
   :root {
     /* SPAIK semantic tokens */
     --accent: 14 100% 66%;           /* #ff7150 */
     --accent-foreground: 0 0% 100%;  /* white on accent */
     --radius: 0.25rem;               /* 4px - SPAIK md */
   }

   .dark {
     /* Adjusted for dark backgrounds */
     --accent: 14 100% 70%;           /* Slightly brighter */
     --accent-foreground: 0 0% 10%;   /* Dark text on bright */
   }
   ```

2. **`tailwind.config.js`** - Delete `tailwind.config.ts` (duplicate)
   - No changes needed to .js file - CSS variables handle theming
   - Optionally add SPAIK brand colors for direct utility access:
   ```typescript
   colors: {
     spaik: {
       orange: { 400: '#ff7150', 500: '#d96044' },
       clay: { 100: '#f7f6f2', 400: '#dedccc' },
       lilac: { 400: '#e1d2ff' },
       blue: { 400: '#a2bdf0' },
     }
   }
   ```

3. **`components/ui/button.tsx`** (line 23) - Action variant using semantic class
   ```typescript
   // Use CSS variable, NOT hardcoded hex
   action: "bg-accent text-accent-foreground hover:bg-accent/90"
   ```

4. **Delete `tailwind.config.ts`** - Remove duplicate config file

### Phase 3: Export Presets

**New files to create:**

1. **`lib/exportPresets.ts`** - Type-safe preset definitions
   ```typescript
   import type { DownloadFormat } from '@/app/DownloadButton';

   type PresetCategory = 'internal-tools' | 'micro-saas' | 'social' | 'print';

   interface ExportPreset {
     readonly id: string;
     readonly name: string;
     readonly category: PresetCategory;
     readonly dimensions: {
       readonly width: number;
       readonly height: number;
     };
     readonly formats: readonly DownloadFormat[];
     readonly scale?: number; // For retina exports
   }

   export const EXPORT_PRESETS = [
     // Internal Tools
     { id: 'favicon', name: 'Favicon', category: 'internal-tools',
       dimensions: { width: 32, height: 32 }, formats: ['png'] },
     { id: 'app-icon', name: 'App Icon', category: 'internal-tools',
       dimensions: { width: 512, height: 512 }, formats: ['png'] },
     { id: 'sidebar-logo', name: 'Sidebar Logo', category: 'internal-tools',
       dimensions: { width: 120, height: 40 }, formats: ['png', 'svg'] },

     // Micro-SaaS
     { id: 'og-image', name: 'OG Image', category: 'micro-saas',
       dimensions: { width: 1200, height: 630 }, formats: ['png'] },
     { id: 'twitter-card', name: 'Twitter Card', category: 'micro-saas',
       dimensions: { width: 1200, height: 600 }, formats: ['png'] },
     { id: 'email-header', name: 'Email Header', category: 'micro-saas',
       dimensions: { width: 600, height: 150 }, formats: ['png'] },

     // Social
     { id: 'instagram', name: 'Instagram Post', category: 'social',
       dimensions: { width: 1080, height: 1080 }, formats: ['png'] },
     { id: 'linkedin-banner', name: 'LinkedIn Banner', category: 'social',
       dimensions: { width: 1128, height: 191 }, formats: ['png'] },

     // Print
     { id: 'business-card', name: 'Business Card', category: 'print',
       dimensions: { width: 1050, height: 600 }, formats: ['png', 'svg'] },
   ] as const satisfies readonly ExportPreset[];

   // Derived types for type-safe access
   export type PresetId = (typeof EXPORT_PRESETS)[number]['id'];
   export type { ExportPreset, PresetCategory };
   ```

2. **`components/custom/ExportPresetMenu.tsx`** - Preset selector UI
   ```typescript
   'use client';

   import { EXPORT_PRESETS, type PresetId, type PresetCategory } from '@/lib/exportPresets';

   interface ExportPresetMenuProps {
     onSelect: (presetId: PresetId) => void;
     selectedCategory?: PresetCategory;
   }

   export function ExportPresetMenu({ onSelect, selectedCategory }: ExportPresetMenuProps) {
     const filteredPresets = selectedCategory
       ? EXPORT_PRESETS.filter(p => p.category === selectedCategory)
       : EXPORT_PRESETS;

     // Group by category for UI
     // ... implementation
   }
   ```

**Files to modify:**

3. **`app/DownloadButton.tsx`** (lines 139-146)
   - Update filename template: `spaik-${sanitizedText}-${preset}.${format}`
   - Integrate preset selector component
   - Handle dimension-aware exports (temporary resize -> capture -> restore)

4. **`lib/exportManager.ts`** (lines 39, 58, 77, 107, 129, 135)
   - Update JSON export filenames from `wordmark-*` to `spaik-*`
   - Fix `downloadJSON` function: change `data: any` to `data: ExportDataType`

### Phase 4: State & Storage Updates

**Files to modify:**

1. **`lib/statemanager.ts`** (lines 53-75) - Update defaults
   ```typescript
   // Note: IColor requires full rgb/hsv objects, not just hex
   import { hexToIColor } from './colorUtils'; // Helper function

   textAtom: {
     text: "SPAIK.",
     color: hexToIColor("#000000")
   }
   iconAtom: {
     color: hexToIColor("#ff7150")  // SPAIK accent
   }
   ```

2. **`lib/colorUtils.ts`** - NEW helper for IColor conversion
   ```typescript
   import { IColor } from 'react-color-palette';

   export function hexToIColor(hex: string): IColor {
     // Convert hex to full IColor with rgb and hsv
     const r = parseInt(hex.slice(1, 3), 16);
     const g = parseInt(hex.slice(3, 5), 16);
     const b = parseInt(hex.slice(5, 7), 16);
     // ... calculate hsv
     return { hex, rgb: { r, g, b, a: 1 }, hsv: { h, s, v, a: 1 } };
   }
   ```

3. **`lib/versionHistory.ts`** (lines 68-71) - Storage keys
   ```typescript
   // Simply rename - no migration needed (no existing users)
   favoriteVersionsAtom key = "spaik-favorites"
   ```

### Phase 5: SPAIK Fonts

**Fonts are licensed and ready to use.**

**Files to modify:**

1. **`app/layout.tsx`** - Import local fonts via `next/font/local`
   ```typescript
   import localFont from 'next/font/local';

   const ivyPresto = localFont({
     src: '../public/fonts/spaik/IvyPrestoHeadline-Regular.woff2',
     variable: '--font-ivy-presto',
   });

   const agrandir = localFont({
     src: '../public/fonts/spaik/AgrandirVariable.woff2',
     variable: '--font-agrandir',
   });
   ```

2. **`lib/fontProviders/custom.ts`** - Add SPAIK fonts to picker
   - Register Ivy Presto Headline, Agrandir Variable as available fonts
   - Category: "SPAIK Brand Fonts"

3. **`public/fonts/spaik/`** - Add font files
   - `IvyPrestoHeadline-Regular.woff2`
   - `AgrandirVariable.woff2`
   - `SFPro-Regular.woff2` (if needed)

---

## File Summary

| Priority | File | Changes |
|----------|------|---------|
| **P1** | `app/layout.tsx` | Metadata + font imports |
| **P1** | `app/manifest.ts` | PWA config |
| **P1** | `app/page.tsx` | Header branding |
| **P1** | `public/` | All icons/images/fonts |
| **P2** | `app/globals.css` | CSS variables (light + dark) |
| **P2** | `components/ui/button.tsx` | Semantic action variant |
| **P2** | `tailwind.config.ts` | **DELETE** - duplicate |
| **P3** | `lib/exportPresets.ts` | **NEW** - Type-safe presets |
| **P3** | `components/custom/ExportPresetMenu.tsx` | **NEW** - UI |
| **P3** | `app/DownloadButton.tsx` | Filenames, preset integration |
| **P3** | `lib/exportManager.ts` | JSON filenames + fix `any` type |
| **P4** | `lib/statemanager.ts` | Default values |
| **P4** | `lib/colorUtils.ts` | **NEW** - IColor helper |
| **P4** | `lib/versionHistory.ts` | Storage keys |
| **P5** | `lib/fontProviders/custom.ts` | SPAIK fonts in picker |
| **P5** | `app/Credits.tsx` | Footer attribution |

---

## Clarifications (Resolved)

| Question | Answer |
|----------|--------|
| Export behavior | Single file per preset (no ZIP) |
| SPAIK fonts | Licensed for web embedding, self-hosted |
| Logo colors | Fully customizable (existing behavior) |
| Storage migration | Not needed (no existing users) |

---

## Testing Checklist

- [ ] All "Wordmark" strings replaced
- [ ] PWA installs with correct name/icons
- [ ] Light mode accent color is #ff7150
- [ ] Dark mode accent color visible and accessible
- [ ] Button action variant works in both modes
- [ ] Export presets produce correct dimensions
- [ ] SPAIK fonts appear in font picker
- [ ] New designs start with "SPAIK." text
- [ ] Default icon color is SPAIK orange
- [ ] JSON exports use "spaik-" prefix
- [ ] Cross-browser: Chrome, Safari, Firefox

---

## References

- [SPAIK Design Tokens](SPAIK%20Branding/Design%20tokens/tokens.json)
- [SPAIK Logos](SPAIK%20Branding/Logo/)
- [SPAIK Fonts](SPAIK%20Branding/Fonts/)
- [shadcn/ui Theming Docs](https://ui.shadcn.com/docs/theming)
