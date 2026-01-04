# Wordmark - Project Instructions

## Overview
Wordmark is a web-based logo creation tool. This fork is customized as an **internal branding tool** for consistent company/team branding.

**Original**: [abhayramesh/wordmark](https://github.com/abhayramesh/wordmark)

## Commands
```bash
pnpm install      # Install dependencies
pnpm dev          # Development server (localhost:3000)
pnpm build        # Production build
pnpm lint         # ESLint
pnpm format       # Prettier formatting
```

## Tech Stack
- **Framework**: Next.js 13 (App Router), React 18, TypeScript
- **State**: Jotai (atoms) + Zustand (download store)
- **UI**: shadcn/ui + Radix primitives + Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Export**: html-to-image, html2canvas
- **Fonts**: Google, Adobe, Font Squirrel, Font Source, Open Foundry

## Project Structure
```
app/                    # Next.js pages, API routes, tab components
  _tabs/                # Tab UI components (Text, Card, Icon, Layout)
  api/                  # API routes
components/
  custom/               # Feature components (FontSelector, VersionHistory)
  ui/                   # shadcn/ui primitives
lib/
  fontProviders/        # Font provider integrations
  statemanager.ts       # Jotai atoms (global state)
  hooks/                # Custom React hooks
data/                   # Static font JSON data
```

## Key Files
- [lib/statemanager.ts](lib/statemanager.ts) - All Jotai atoms
- [lib/fontProviders/index.ts](lib/fontProviders/index.ts) - Font provider orchestration
- [components/custom/FontSelector.tsx](components/custom/FontSelector.tsx) - Font selection (large, refactor candidate)
- [app/page.tsx](app/page.tsx) - Main entry point

## Conventions
- All components use `"use client"` directive
- Jotai atoms named with `Atom` suffix (e.g., `fontAtom`, `textAtom`)
- **Conventional Commits** required (feat, fix, docs, style, refactor, perf, test, chore)
- **File length**: Target under 300 LOC per file

## Fork Priorities
1. Customizations for internal branding consistency
2. Keep upstream compatibility where sensible
3. Focus on features that support team branding workflows

## Known Issues
- No test suite configured
- Several files exceed 300 LOC guideline
- FontSelector.tsx (34KB) - candidate for breaking into smaller modules
