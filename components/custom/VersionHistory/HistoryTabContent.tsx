"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HistoryTabContentProps } from "./types";
import { VersionCard } from "./VersionCard";

export function HistoryTabContent({
  history,
  currentIndex,
  scrollContainerRef,
  currentCardRef,
  onVersionClick,
  onScrollLeft,
  onScrollRight,
}: HistoryTabContentProps) {
  return (
    <div className="relative w-full">
      <Button
        variant="ghost"
        size="icon"
        onClick={onScrollLeft}
        className="absolute left-0 top-1/2 z-10 h-8 w-8 -translate-y-1/2 transform bg-background/80"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <ScrollArea className="w-full pb-2">
        <div
          className="flex space-x-3 px-6 py-3"
          ref={scrollContainerRef}
        >
          {history.map((version, index) => (
            <div
              key={version.id}
              ref={index === currentIndex ? currentCardRef : null}
            >
              <VersionCard
                version={version}
                isActive={index === currentIndex}
                onClick={() => onVersionClick(index)}
              />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <Button
        variant="ghost"
        size="icon"
        onClick={onScrollRight}
        className="absolute right-0 top-1/2 z-10 h-8 w-8 -translate-y-1/2 transform bg-background/80"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
