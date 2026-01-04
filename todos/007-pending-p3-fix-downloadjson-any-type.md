---
status: pending
priority: p3
issue_id: "007"
tags: [code-review, typescript, type-safety]
dependencies: []
---

# Fix `any` Type in downloadJSON Function

## Problem Statement

The `downloadJSON` function in `lib/exportManager.ts` uses `any` type for its data parameter, bypassing TypeScript's type checking. Since this file is being modified for branding changes anyway, this technical debt should be addressed.

## Findings

**Location:** `/lib/exportManager.ts:135`
```typescript
function downloadJSON(data: any, filename: string): void {
```

**`ExportDataType` already exists in the file** and could be used instead:
```typescript
type ExportDataType =
  | { type: "favorites"; data: FavoriteVersion[] }
  | { type: "history"; data: HistoryItem[] }
  | { type: "design"; data: DesignExport };
```

## Proposed Solutions

### Option 1: Use Existing ExportDataType (Recommended)

**Approach:** Replace `any` with the existing union type.

```typescript
function downloadJSON(data: ExportDataType, filename: string): void {
```

**Pros:**
- Uses existing type
- Type-safe
- No new code needed

**Cons:**
- None

**Effort:** 5 minutes

**Risk:** Low

## Recommended Action

**To be filled during triage.** Simple fix, do it while modifying the file for branding.

## Technical Details

**Affected files:**
- `lib/exportManager.ts:135` - downloadJSON function signature

## Acceptance Criteria

- [ ] `downloadJSON` parameter typed as `ExportDataType`
- [ ] No TypeScript errors
- [ ] Export functionality still works

## Work Log

### 2026-01-04 - Plan Review

**By:** Claude Code (kieran-typescript-reviewer agent)

**Actions:**
- Identified `any` type usage
- Found existing type that should be used

**Learnings:**
- File already has proper types, just not applied to this function
