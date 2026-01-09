"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import {
  undoAtom,
  redoAtom,
  pushSnapshotAtom,
  canUndoAtom,
  canRedoAtom,
  currentSnapshotAtom,
  undoRedoAtom,
} from "../statemanager";
import type { DesignSnapshot } from "../types/design";

// Debounce delay for auto-saving snapshots (ms)
const DEBOUNCE_DELAY = 500;

/**
 * Hook for managing undo/redo functionality
 */
export function useUndoRedo() {
  const undo = useSetAtom(undoAtom);
  const redo = useSetAtom(redoAtom);
  const pushSnapshot = useSetAtom(pushSnapshotAtom);
  const canUndo = useAtomValue(canUndoAtom);
  const canRedo = useAtomValue(canRedoAtom);
  const currentSnapshot = useAtomValue(currentSnapshotAtom);
  const [undoRedoState] = useAtom(undoRedoAtom);

  const handleUndo = useCallback(() => {
    if (canUndo) {
      undo();
    }
  }, [canUndo, undo]);

  const handleRedo = useCallback(() => {
    if (canRedo) {
      redo();
    }
  }, [canRedo, redo]);

  const saveSnapshot = useCallback(() => {
    pushSnapshot();
  }, [pushSnapshot]);

  return {
    undo: handleUndo,
    redo: handleRedo,
    saveSnapshot,
    canUndo,
    canRedo,
    historyLength: undoRedoState.past.length,
    futureLength: undoRedoState.future.length,
    currentSnapshot,
  };
}

/**
 * Hook for auto-saving snapshots on state changes
 * Uses debouncing to avoid saving too frequently
 */
export function useAutoSaveSnapshot() {
  const pushSnapshot = useSetAtom(pushSnapshotAtom);
  const currentSnapshot = useAtomValue(currentSnapshotAtom);
  const previousSnapshot = useRef<DesignSnapshot | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scheduleSnapshot = useCallback(() => {
    // Clear any pending save
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Schedule a new save
    timeoutRef.current = setTimeout(() => {
      pushSnapshot();
    }, DEBOUNCE_DELAY);
  }, [pushSnapshot]);

  // Check if snapshot changed meaningfully (ignore timestamp)
  const hasChanged = useCallback(
    (prev: DesignSnapshot | null, curr: DesignSnapshot): boolean => {
      if (!prev) return true;

      // Compare text state
      if (
        prev.text.text !== curr.text.text ||
        prev.text.color.hex !== curr.text.color.hex ||
        prev.text.size !== curr.text.size ||
        prev.text.fontWeight !== curr.text.fontWeight
      ) {
        return true;
      }

      // Compare icon state
      if (
        prev.icon.icon !== curr.icon.icon ||
        prev.icon.color.hex !== curr.icon.color.hex ||
        prev.icon.size !== curr.icon.size
      ) {
        return true;
      }

      // Compare card state
      if (
        prev.card.color.hex !== curr.card.color.hex ||
        prev.card.width.value !== curr.card.width.value ||
        prev.card.height.value !== curr.card.height.value
      ) {
        return true;
      }

      // Compare layout
      if (prev.layout !== curr.layout) {
        return true;
      }

      return false;
    },
    []
  );

  useEffect(() => {
    if (hasChanged(previousSnapshot.current, currentSnapshot)) {
      scheduleSnapshot();
      previousSnapshot.current = currentSnapshot;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentSnapshot, hasChanged, scheduleSnapshot]);
}

/**
 * Hook for keyboard shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z)
 */
export function useUndoRedoKeyboard() {
  const { undo, redo, canUndo, canRedo } = useUndoRedo();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (!modifier) return;

      // Undo: Ctrl+Z (or Cmd+Z on Mac)
      if (e.key === "z" && !e.shiftKey && canUndo) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl+Y (Windows) or Ctrl+Shift+Z / Cmd+Shift+Z
      if (
        (e.key === "y" && canRedo) ||
        (e.key === "z" && e.shiftKey && canRedo)
      ) {
        e.preventDefault();
        redo();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);
}
