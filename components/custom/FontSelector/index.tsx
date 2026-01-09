"use client";

import { useCallback, useMemo, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { ExtendedFontItem } from "@/lib/fontProviders";
import { getAllFontList, getFontsByProvider } from "@/lib/fontProviders";
import { fontAtom, textAtom } from "@/lib/statemanager";
import { cn } from "@/lib/utils";
import { Loader2, Shuffle } from "lucide-react";
import { FontLoader } from "@/lib/fonts";
import { FontProviderSelector } from "../FontProviderSelector";
import { useFontSearch } from "@/lib/hooks/useFontSearch";
import { FontSearchInput } from "./FontSearchInput";
import { FontFilters } from "./FontFilters";
import { FontList } from "./FontList";
import { SelectedFontBar } from "./SelectedFontBar";
import { FontProviderType, FontFilterState } from "./types";

interface FontSelectorProps {
  className?: string;
}

export function FontSelector({ className }: FontSelectorProps) {
  const [selectedFont, setSelectedFont] =
    useAtom<ExtendedFontItem | undefined>(fontAtom);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSampleText, setShowSampleText] = useState(false);
  const [randomizing, setRandomizing] = useState(false);
  const textState = useAtomValue(textAtom);
  const [activeProvider, setActiveProvider] = useState<FontProviderType>("all");
  const [filters, setFilters] = useState<FontFilterState>({
    category: "all",
    weight: "all",
    style: "all",
  });

  // Sample text for preview
  const sampleText = useMemo(() => {
    return textState.text || "The quick brown fox jumps";
  }, [textState.text]);

  // Use the font search hook
  const {
    fonts,
    totalFonts,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    status,
    categoryCounts,
    weightCounts,
    styleCounts,
  } = useFontSearch({
    activeProvider,
    searchTerm,
    filters,
  });

  // Reset filters when provider changes
  const handleProviderChange = useCallback((provider: string) => {
    setActiveProvider(provider as FontProviderType);
    setFilters({ category: "all", weight: "all", style: "all" });
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  // Clear selected font
  const clearSelectedFont = useCallback(() => {
    setSelectedFont(undefined);
  }, [setSelectedFont]);

  // Random font selection
  const selectRandomFont = useCallback(() => {
    const allProviderFonts =
      activeProvider === "all"
        ? getAllFontList()
        : getFontsByProvider(activeProvider);

    if (allProviderFonts.length > 0) {
      setRandomizing(true);
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * allProviderFonts.length);
        const randomFont = allProviderFonts[randomIndex];
        setSelectedFont(randomFont);
        setRandomizing(false);
      }, 300);
    }
  }, [activeProvider, setSelectedFont]);

  return (
    <div
      className={cn("flex h-full w-full flex-col overflow-hidden", className)}
    >
      {/* Search and Provider Selection */}
      <div className="flex-none space-y-2 p-2">
        <div className="flex items-center gap-2">
          <FontSearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={clearSearch}
          />
          <FontProviderSelector
            className="w-[180px] flex-none"
            onChange={handleProviderChange}
          />
        </div>

        {/* Toggles row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <FontFilters
              filters={filters}
              onFiltersChange={setFilters}
              categoryCounts={categoryCounts}
              weightCounts={weightCounts}
              styleCounts={styleCounts}
              totalFonts={totalFonts}
              filteredCount={fonts.length}
            />
            {!selectedFont && (
              <Button
                variant="secondary"
                size="sm"
                className="h-7 gap-1.5 px-2 text-xs"
                onClick={selectRandomFont}
                disabled={randomizing}
              >
                {randomizing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Shuffle className="h-3.5 w-3.5" />
                )}
                <span className="text-xs">Random</span>
              </Button>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center space-x-1.5">
              <Switch
                id="sample-text"
                checked={showSampleText}
                onCheckedChange={setShowSampleText}
                className="scale-75"
              />
              <Label htmlFor="sample-text" className="text-xs">
                Preview Text
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Font List */}
      <FontList
        fonts={fonts}
        selectedFont={selectedFont}
        status={status}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage ?? false}
        showSampleText={showSampleText}
        sampleText={sampleText}
        onSelectFont={setSelectedFont}
        onFetchNextPage={fetchNextPage}
      />

      {/* Selected Font Bar */}
      {selectedFont && (
        <SelectedFontBar
          font={selectedFont}
          isRandomizing={randomizing}
          onRandomFont={selectRandomFont}
          onClear={clearSelectedFont}
        />
      )}

      <FontLoader fonts={[{ font: "Inter" }]} />
    </div>
  );
}

export default FontSelector;
