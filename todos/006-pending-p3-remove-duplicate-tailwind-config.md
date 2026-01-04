---
status: pending
priority: p3
issue_id: "006"
tags: [code-review, cleanup, configuration]
dependencies: []
---

# Remove Duplicate tailwind.config.ts File

## Problem Statement

The project has two Tailwind configuration files: `tailwind.config.js` (20 lines) and `tailwind.config.ts` (20 lines). The `components.json` points to `.js`. This creates confusion about which file is authoritative.

## Findings

- `tailwind.config.js` exists and is referenced by `components.json`
- `tailwind.config.ts` also exists with similar content
- Plan mentions modifying `tailwind.config.ts` but `.js` is the active file
- Having both files can cause build inconsistencies

## Proposed Solutions

### Option 1: Delete .ts, Keep .js (Recommended)

**Approach:** Remove `tailwind.config.ts`, keep `tailwind.config.js` as the single config.

**Pros:**
- Single source of truth
- Matches components.json reference
- No build confusion

**Cons:**
- Lose TypeScript in config (minor - config files don't need types)

**Effort:** 5 minutes

**Risk:** Low

---

### Option 2: Migrate to .ts, Update References

**Approach:** Delete `.js`, update `components.json` to point to `.ts`.

**Pros:**
- TypeScript support in config
- Modern approach

**Cons:**
- May require postcss config updates
- More changes

**Effort:** 15 minutes

**Risk:** Low

## Recommended Action

**To be filled during triage.**

## Technical Details

**Files involved:**
- `tailwind.config.js` - Currently active
- `tailwind.config.ts` - Duplicate to remove
- `components.json` - References `tailwind.config.js`

## Acceptance Criteria

- [ ] Only one tailwind.config file exists
- [ ] Build still works
- [ ] shadcn/ui components still styled correctly

## Work Log

### 2026-01-04 - Plan Review

**By:** Claude Code (best-practices-researcher agent)

**Actions:**
- Identified duplicate config files
- Verified which is referenced by components.json

**Learnings:**
- shadcn/ui uses components.json to locate tailwind config
- Having both .js and .ts configs causes confusion
