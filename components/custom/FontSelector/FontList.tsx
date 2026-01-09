"use client";

import type { ExtendedFontItem } from "@/lib/fontProviders";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";
import { useCallback, useRef } from "react";
import { FontListItem } from "./FontListItem";

interface FontListProps {
  fonts: ExtendedFontItem[];
  selectedFont: ExtendedFontItem | undefined;
  status: "pending" | "error" | "success";
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  showSampleText: boolean;
  sampleText: string;
  onSelectFont: (font: ExtendedFontItem) => void;
  onFetchNextPage: () => void;
}

export function FontList({
  fonts,
  selectedFont,
  status,
  isFetchingNextPage,
  hasNextPage,
  showSampleText,
  sampleText,
  onSelectFont,
  onFetchNextPage,
}: FontListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const scrollThreshold = 0.8;
      const nearEnd =
        scrollTop + clientHeight >= scrollHeight * scrollThreshold;

      if (nearEnd && !isFetchingNextPage && hasNextPage) {
        onFetchNextPage();
      }
    },
    [isFetchingNextPage, hasNextPage, onFetchNextPage]
  );

  if (status === "pending") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-10 text-muted-foreground">
        <Loader2 className="mb-2 h-5 w-5 animate-spin" />
        <p className="text-xs">Loading fonts</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-1 items-center justify-center py-10 text-destructive">
        <p className="text-sm">Error loading fonts</p>
      </div>
    );
  }

  if (fonts.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-10 text-muted-foreground">
        <p className="text-sm">No fonts found</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-background/20"
      onScroll={handleScroll}
    >
      <div className="grid gap-0.5 p-1">
        <TooltipProvider>
          {fonts.map((font) => (
            <FontListItem
              key={font.family}
              font={font}
              isSelected={selectedFont?.family === font.family}
              showSampleText={showSampleText}
              sampleText={sampleText}
              onSelect={onSelectFont}
            />
          ))}
        </TooltipProvider>

        {isFetchingNextPage && (
          <div className="col-span-1 w-full py-2 text-center">
            <Loader2 className="mx-auto h-4 w-4 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
