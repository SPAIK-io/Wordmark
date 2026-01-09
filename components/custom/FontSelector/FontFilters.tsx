"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import {
  FontFilterState,
  FONT_CATEGORIES,
  FONT_WEIGHTS,
  FONT_STYLES,
} from "./types";

interface FontFiltersProps {
  filters: FontFilterState;
  onFiltersChange: (filters: FontFilterState) => void;
  categoryCounts: Record<string, number>;
  weightCounts: Record<string, number>;
  styleCounts: Record<string, number>;
  totalFonts: number;
  filteredCount: number;
}

export function FontFilters({
  filters,
  onFiltersChange,
  categoryCounts,
  weightCounts,
  styleCounts,
  totalFonts,
  filteredCount,
}: FontFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [weightOpen, setWeightOpen] = useState(false);
  const [styleOpen, setStyleOpen] = useState(false);

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.weight !== "all" ||
    filters.style !== "all";

  const clearFilters = () => {
    onFiltersChange({ category: "all", weight: "all", style: "all" });
  };

  const updateFilter = (key: keyof FontFilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <>
      <div className="flex items-center gap-1.5">
        <Button
          variant={showFilters ? "secondary" : "outline"}
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2 text-xs"
            onClick={clearFilters}
          >
            Clear
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="space-y-1.5 rounded-md bg-muted/30 p-2">
          <div className="flex flex-wrap gap-2">
            {/* Category filter */}
            <Select
              value={filters.category}
              onValueChange={(v) => updateFilter("category", v)}
              open={categoryOpen}
              onOpenChange={setCategoryOpen}
            >
              <SelectTrigger className="h-8 w-[140px] text-xs">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {FONT_CATEGORIES.map((category) => (
                  <SelectItem
                    key={category.value}
                    value={category.value}
                    className="text-xs"
                  >
                    {category.label}
                    {categoryOpen &&
                      category.value !== "all" &&
                      filters.category !== category.value && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          {categoryCounts[category.value] || 0}
                        </span>
                      )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Weight filter */}
            <Select
              value={filters.weight}
              onValueChange={(v) => updateFilter("weight", v)}
              open={weightOpen}
              onOpenChange={setWeightOpen}
            >
              <SelectTrigger className="h-8 w-[140px] text-xs">
                <SelectValue placeholder="Weight" />
              </SelectTrigger>
              <SelectContent>
                {FONT_WEIGHTS.map((weight) => (
                  <SelectItem
                    key={weight.value}
                    value={weight.value}
                    className="text-xs"
                  >
                    {weight.label}
                    {weightOpen &&
                      weight.value !== "all" &&
                      filters.weight !== weight.value && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          {weightCounts[weight.value] || 0}
                        </span>
                      )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Style filter */}
            <Select
              value={filters.style}
              onValueChange={(v) => updateFilter("style", v)}
              open={styleOpen}
              onOpenChange={setStyleOpen}
            >
              <SelectTrigger className="h-8 w-[140px] text-xs">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                {FONT_STYLES.map((style) => (
                  <SelectItem
                    key={style.value}
                    value={style.value}
                    className="text-xs"
                  >
                    {style.label}
                    {styleOpen &&
                      style.value !== "all" &&
                      filters.style !== style.value && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          {styleCounts[style.value] || 0}
                        </span>
                      )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <div className="text-xs text-muted-foreground">
              Showing {filteredCount} of {totalFonts} fonts
            </div>
          )}
        </div>
      )}
    </>
  );
}
