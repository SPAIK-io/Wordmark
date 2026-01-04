---
status: pending
priority: p2
issue_id: "005"
tags: [code-review, theming, accessibility]
dependencies: ["003"]
---

# Add Dark Mode Token Values for SPAIK Theme

## Problem Statement

The plan's acceptance criteria states "Light/dark mode uses SPAIK semantic colors" but Phase 2 only updates `:root` CSS variables, not the `.dark` selector. This will break dark mode consistency.

## Findings

- Plan only shows `:root` updates (lines 77-83)
- No `.dark` selector values specified
- Current `globals.css` has both `:root` and `.dark` with different values
- Without dark mode tokens, accent will look wrong on dark backgrounds
- SPAIK design tokens (`tokens.json`) don't specify dark mode variants

**Current globals.css structure:**
```css
:root {
  --accent: 210 40% 96.1%;  /* Current light mode */
  /* ... */
}

.dark {
  --accent: 212 100% 47%;   /* Current dark mode */
  /* ... */
}
```

## Proposed Solutions

### Option 1: Derive Dark Mode Values (Recommended)

**Approach:** Calculate appropriate dark mode variants from SPAIK accent.

```css
:root {
  --accent: 14 100% 66%;           /* #ff7150 - SPAIK orange */
  --accent-foreground: 0 0% 100%;  /* white text on orange */
}

.dark {
  --accent: 14 100% 70%;           /* Slightly brighter for dark bg */
  --accent-foreground: 0 0% 10%;   /* Dark text on bright orange */
}
```

**Pros:**
- Complete dark mode support
- Maintains SPAIK brand recognition
- Accessible contrast ratios

**Cons:**
- No official SPAIK dark mode spec to reference
- May need visual testing

**Effort:** 30 minutes

**Risk:** Low

---

### Option 2: Same Values Both Modes

**Approach:** Use identical accent color in light and dark modes.

```css
:root, .dark {
  --accent: 14 100% 66%;
  --accent-foreground: 0 0% 100%;
}
```

**Pros:**
- Perfectly consistent brand color
- Simplest implementation

**Cons:**
- May have contrast issues on dark backgrounds
- Less sophisticated appearance

**Effort:** 15 minutes

**Risk:** Medium (accessibility)

## Recommended Action

**To be filled during triage.** Option 1 provides better UX. Test with both modes enabled.

## Technical Details

**Affected files:**
- `app/globals.css:35-50` - `.dark` selector section

**Tokens that need dark variants:**
- `--accent` - primary action color
- `--accent-foreground` - text on accent
- Consider: `--primary`, `--destructive` if using SPAIK colors

## Acceptance Criteria

- [ ] `.dark` selector has SPAIK-themed accent values
- [ ] Accent color visible and accessible in dark mode
- [ ] Button action variant works in both modes
- [ ] No jarring color jumps when switching modes

## Work Log

### 2026-01-04 - Plan Review

**By:** Claude Code (best-practices-researcher agent)

**Actions:**
- Identified missing dark mode tokens in plan
- Analyzed current globals.css structure
- Proposed dark mode value derivation

**Learnings:**
- shadcn/ui requires both :root and .dark selectors
- SPAIK tokens.json doesn't include dark mode specs
- Derived dark values should be tested visually
