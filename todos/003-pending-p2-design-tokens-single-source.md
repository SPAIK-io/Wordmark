---
status: pending
priority: p2
issue_id: "003"
tags: [code-review, architecture, dry]
dependencies: []
---

# Consolidate Design Tokens to Single Source of Truth

## Problem Statement

The plan proposes defining SPAIK colors in three separate places, violating DRY principles. When the accent color changes, developers must update multiple files - a maintenance burden and source of inconsistency bugs.

## Findings

**Colors defined in multiple places:**
1. `globals.css` (lines 77-82) - CSS variables: `--accent: 14 100% 66%`
2. `tailwind.config.ts` (lines 86-94) - Tailwind theme: `orange: { 400: '#ff7150' }`
3. `button.tsx` (lines 97-100) - Inline hex: `bg-[#ff7150]`

**Additional issues:**
- HSL format in CSS vars, hex format elsewhere (inconsistent)
- Button uses arbitrary value `bg-[#ff7150]` bypassing token system
- Dark mode tokens not defined in plan

## Proposed Solutions

### Option 1: CSS Variables as Single Source (Recommended for shadcn/ui)

**Approach:** Define tokens only in `globals.css`, reference via Tailwind's CSS variable integration.

```css
/* globals.css */
:root {
  --accent: 14 100% 66%;           /* #ff7150 */
  --accent-foreground: 0 0% 100%;  /* white */
}

.dark {
  --accent: 14 100% 70%;           /* Slightly adjusted */
  --accent-foreground: 0 0% 10%;
}
```

```typescript
// button.tsx - use semantic class
action: "bg-accent text-accent-foreground hover:bg-accent/90"
```

**Pros:**
- Single source of truth
- Automatic dark mode support
- Follows shadcn/ui conventions
- No Tailwind config changes needed

**Cons:**
- Can't use `bg-spaik-orange-400` utility directly

**Effort:** 1 hour

**Risk:** Low

---

### Option 2: Design Tokens TypeScript File

**Approach:** Create `lib/designTokens.ts` as the source, import everywhere.

```typescript
// lib/designTokens.ts
export const SPAIK_COLORS = {
  orange: { 400: '#ff7150', 500: '#d96044' },
  clay: { 100: '#f7f6f2', 400: '#dedccc' },
} as const;

export const SPAIK_ACCENT = SPAIK_COLORS.orange[400];
```

Import in tailwind.config and use for any runtime needs.

**Pros:**
- TypeScript type safety
- Can be imported anywhere
- Single definition

**Cons:**
- Can't use in CSS directly
- More complex setup

**Effort:** 2 hours

**Risk:** Low

---

### Option 3: Both CSS Variables AND Tailwind Brand Colors

**Approach:** Use CSS variables for semantic tokens, Tailwind config for brand palette.

**Pros:**
- Flexibility for both semantic and brand usage
- `bg-accent` and `bg-spaik-orange-400` both available

**Cons:**
- Still two places to update (though different purposes)
- More configuration

**Effort:** 1.5 hours

**Risk:** Low

## Recommended Action

**To be filled during triage.** Option 1 is simplest for a shadcn/ui project and aligns with existing patterns.

## Technical Details

**Affected files:**
- `app/globals.css:6-50` - CSS variable definitions
- `components/ui/button.tsx:23-24` - action variant
- `tailwind.config.ts` - potentially remove color additions

**Current button.tsx action variant (line 23):**
```typescript
action: "bg-blue-600 text-white hover:bg-blue-700",
```

## Acceptance Criteria

- [ ] SPAIK accent color defined in one authoritative location
- [ ] Button action variant uses semantic class (not hardcoded hex)
- [ ] Dark mode has corresponding token values
- [ ] No hardcoded `#ff7150` in component files

## Work Log

### 2026-01-04 - Plan Review

**By:** Claude Code (pattern-recognition-specialist, best-practices-researcher agents)

**Actions:**
- Identified DRY violation in color definitions
- Analyzed shadcn/ui theming conventions
- Recommended CSS variables as primary source

**Learnings:**
- shadcn/ui expects CSS variables in HSL format
- Tailwind's arbitrary value syntax `bg-[#hex]` should be avoided
- Dark mode support requires `.dark` selector tokens
