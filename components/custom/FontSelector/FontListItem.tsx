"use client";

import type { ExtendedFontItem } from "@/lib/fontProviders";
import { FontLoader } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { PROVIDER_NAMES } from "./types";

interface FontListItemProps {
  font: ExtendedFontItem;
  isSelected: boolean;
  showSampleText: boolean;
  sampleText: string;
  onSelect: (font: ExtendedFontItem) => void;
}

export function FontListItem({
  font,
  isSelected,
  showSampleText,
  sampleText,
  onSelect,
}: FontListItemProps) {
  const providerLabel = font.provider
    ? PROVIDER_NAMES[font.provider] || font.provider
    : null;

  return (
    <>
      <button
        className={cn(
          "w-full rounded px-3 py-1.5 text-left transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          isSelected ? "bg-accent text-accent-foreground" : "bg-transparent"
        )}
        onClick={() => onSelect(font)}
      >
        {showSampleText ? (
          <div className="flex flex-col gap-0.5">
            <span
              style={{
                fontFamily: font.family,
                fontSize: "16px",
                lineHeight: "1.2",
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxHeight: "30px",
              }}
            >
              {sampleText}
            </span>
            <span
              className={cn(
                "text-xs opacity-70",
                isSelected ? "text-accent-foreground" : "text-muted-foreground"
              )}
            >
              {font.family}
              {providerLabel && ` · ${providerLabel}`}
            </span>
          </div>
        ) : (
          <div className="flex flex-col">
            <span
              style={{
                fontFamily: font.family,
                fontSize: "15px",
                lineHeight: "1.2",
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {font.family}
            </span>
            {providerLabel && (
              <span className="text-xs text-muted-foreground">
                {providerLabel}
              </span>
            )}
          </div>
        )}
      </button>
      <FontLoader fonts={[{ font: font.family }]} />
    </>
  );
}
