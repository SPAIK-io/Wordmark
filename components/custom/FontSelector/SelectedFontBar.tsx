"use client";

import type { ExtendedFontItem } from "@/lib/fontProviders";
import { Button } from "@/components/ui/button";
import { Loader2, Shuffle } from "lucide-react";
import { PROVIDER_NAMES } from "./types";

interface SelectedFontBarProps {
  font: ExtendedFontItem;
  isRandomizing: boolean;
  onRandomFont: () => void;
  onClear: () => void;
}

export function SelectedFontBar({
  font,
  isRandomizing,
  onRandomFont,
  onClear,
}: SelectedFontBarProps) {
  const providerLabel = font.provider
    ? PROVIDER_NAMES[font.provider] || font.provider
    : null;

  return (
    <div className="flex-none border-t border-border/30 bg-accent/10 px-3 py-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div
            className="truncate text-sm font-medium"
            style={{
              fontFamily: font.family,
              fontSize: "16px",
            }}
          >
            {font.family}
          </div>
          {providerLabel && (
            <div className="text-xs text-muted-foreground">{providerLabel}</div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={onRandomFont}
            disabled={isRandomizing}
            title="Try a random font"
          >
            {isRandomizing ? (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            ) : (
              <Shuffle className="mr-1 h-3 w-3" />
            )}
            Random
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={onClear}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
