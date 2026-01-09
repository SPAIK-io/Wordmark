"use client";

import { useEffect, useCallback, useRef } from "react";
import { useSetAtom } from "jotai";
import { exportDialogOpenAtom, undoAtom, redoAtom, canUndoAtom, canRedoAtom } from "../statemanager";
import { useAtomValue } from "jotai";

type ShortcutHandler = () => void;

interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  handler: ShortcutHandler;
  description: string;
}

interface KeyboardShortcutsConfig {
  enabled?: boolean;
  shortcuts?: Shortcut[];
}

/**
 * Platform detection for modifier keys
 */
function isMac(): boolean {
  if (typeof navigator === "undefined") return false;
  return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
}

/**
 * Check if an element is editable (input, textarea, contenteditable)
 */
function isEditableElement(element: Element | null): boolean {
  if (!element) return false;
  const tagName = element.tagName.toLowerCase();
  if (tagName === "input" || tagName === "textarea") return true;
  if (element.getAttribute("contenteditable") === "true") return true;
  return false;
}

/**
 * Hook for handling keyboard shortcuts
 */
export function useKeyboardShortcuts(config: KeyboardShortcutsConfig = {}) {
  const { enabled = true, shortcuts = [] } = config;
  const shortcutsRef = useRef(shortcuts);

  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if typing in an editable field
      if (isEditableElement(e.target as Element)) return;

      const isMacOS = isMac();

      for (const shortcut of shortcutsRef.current) {
        const ctrl = shortcut.ctrl ?? false;
        const shift = shortcut.shift ?? false;
        const alt = shortcut.alt ?? false;
        const meta = shortcut.meta ?? false;

        // Handle cross-platform Ctrl/Cmd
        const modifierMatch = isMacOS
          ? (ctrl ? e.metaKey : !e.metaKey) || (meta ? e.metaKey : true)
          : (ctrl ? e.ctrlKey : !e.ctrlKey) || (meta ? e.metaKey : true);

        const shiftMatch = shift ? e.shiftKey : !e.shiftKey;
        const altMatch = alt ? e.altKey : !e.altKey;
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

        // For Ctrl shortcuts on Mac, check metaKey
        // For Ctrl shortcuts on Windows/Linux, check ctrlKey
        let ctrlOrCmdMatch = true;
        if (ctrl) {
          ctrlOrCmdMatch = isMacOS ? e.metaKey : e.ctrlKey;
        }

        if (ctrlOrCmdMatch && shiftMatch && altMatch && keyMatch) {
          e.preventDefault();
          shortcut.handler();
          return;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled]);
}

/**
 * Default application shortcuts
 */
export function useAppKeyboardShortcuts() {
  const setExportDialogOpen = useSetAtom(exportDialogOpenAtom);
  const undo = useSetAtom(undoAtom);
  const redo = useSetAtom(redoAtom);
  const canUndo = useAtomValue(canUndoAtom);
  const canRedo = useAtomValue(canRedoAtom);

  const handleUndo = useCallback(() => {
    if (canUndo) undo();
  }, [canUndo, undo]);

  const handleRedo = useCallback(() => {
    if (canRedo) redo();
  }, [canRedo, redo]);

  const handleExport = useCallback(() => {
    setExportDialogOpen(true);
  }, [setExportDialogOpen]);

  const shortcuts: Shortcut[] = [
    {
      key: "z",
      ctrl: true,
      handler: handleUndo,
      description: "Undo",
    },
    {
      key: "z",
      ctrl: true,
      shift: true,
      handler: handleRedo,
      description: "Redo",
    },
    {
      key: "y",
      ctrl: true,
      handler: handleRedo,
      description: "Redo (alternative)",
    },
    {
      key: "e",
      ctrl: true,
      handler: handleExport,
      description: "Open export dialog",
    },
    {
      key: "s",
      ctrl: true,
      shift: true,
      handler: handleExport,
      description: "Save/Export (alternative)",
    },
  ];

  useKeyboardShortcuts({ shortcuts });

  return { shortcuts };
}

/**
 * Format shortcut for display
 */
export function formatShortcut(shortcut: Omit<Shortcut, "handler" | "description">): string {
  const parts: string[] = [];
  const isMacOS = isMac();

  if (shortcut.ctrl) {
    parts.push(isMacOS ? "⌘" : "Ctrl");
  }
  if (shortcut.alt) {
    parts.push(isMacOS ? "⌥" : "Alt");
  }
  if (shortcut.shift) {
    parts.push(isMacOS ? "⇧" : "Shift");
  }
  if (shortcut.meta && !shortcut.ctrl) {
    parts.push(isMacOS ? "⌘" : "Win");
  }

  parts.push(shortcut.key.toUpperCase());

  return parts.join(isMacOS ? "" : "+");
}

/**
 * Get all available shortcuts with formatted keys
 */
export function getFormattedShortcuts(): { key: string; description: string }[] {
  return [
    { key: formatShortcut({ key: "z", ctrl: true }), description: "Undo" },
    { key: formatShortcut({ key: "z", ctrl: true, shift: true }), description: "Redo" },
    { key: formatShortcut({ key: "y", ctrl: true }), description: "Redo (alternative)" },
    { key: formatShortcut({ key: "e", ctrl: true }), description: "Open export dialog" },
    { key: formatShortcut({ key: "s", ctrl: true, shift: true }), description: "Save/Export" },
  ];
}
