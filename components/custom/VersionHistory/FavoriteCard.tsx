"use client";

import { LucideIconStatic } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { LayoutVariants } from "../SelectableLayoutCard";
import {
  FAVORITE_CARD_SCALE,
  FavoriteCardProps,
  MIN_FAVORITE_CARD_HEIGHT,
  MIN_FAVORITE_CARD_WIDTH,
} from "./types";

export function FavoriteCard({ favorite, onClick, onRemove }: FavoriteCardProps) {
  const scaleFactor = FAVORITE_CARD_SCALE;
  const width = Math.max(favorite.card.width.value * scaleFactor, MIN_FAVORITE_CARD_WIDTH);
  const height = Math.max(favorite.card.height.value * scaleFactor, MIN_FAVORITE_CARD_HEIGHT);
  const [fontCSS, setFontCSS] = useState<string | null>(null);

  useEffect(() => {
    if (favorite.font?.family) {
      const fetchFont = async () => {
        try {
          const res = await fetch(
            `https://fonts.googleapis.com/css?family=${favorite.font?.family.replace(" ", "+")}`,
          );
          const fontCss = await res.text();
          setFontCSS(fontCss);
        } catch (error) {
          console.error("Error fetching font for favorite:", error);
        }
      };
      fetchFont();
    }
  }, [favorite.font?.family]);

  const getIconPosition = () => {
    const isHorizontal = favorite.layout === "ltr" || favorite.layout === "rtl";
    const isVertical = favorite.layout === "ttd" || favorite.layout === "dtt";

    return {
      top: isHorizontal ? "50%" : "30%",
      left: isVertical ? "50%" : favorite.layout === "ltr" ? "25%" : "75%",
      transform: "translate(-50%, -50%)",
    };
  };

  const shouldShowIcon = favorite.layout !== "text" && favorite.icon;
  const shouldShowText =
    favorite.layout !== "icon" && favorite.layout !== "circle" && favorite.text;

  return (
    <div className="flex flex-col rounded-lg border p-3 transition-colors hover:bg-accent/50">
      <div className="mb-2 flex items-start justify-between">
        <h4 className="truncate pr-2 text-sm font-medium">{favorite.name}</h4>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </Button>
      </div>

      <button
        onClick={onClick}
        className="flex items-center justify-center self-center transition-all hover:ring-1 hover:ring-primary/50"
      >
        <div
          className={cn(
            LayoutVariants({ layout: favorite.layout }),
            "overflow-hidden rounded-md shadow-md",
          )}
          style={{
            backgroundColor: favorite.card.color.hex,
            width: `${width}px`,
            height: `${height}px`,
          }}
        >
          {shouldShowIcon && (
            <div
              className="absolute flex items-center justify-center"
              style={getIconPosition()}
            >
              <LucideIconStatic
                name={favorite.icon.icon}
                size={Math.max(favorite.icon.size * scaleFactor, 10)}
                style={{ color: favorite.icon.color.hex }}
              />
            </div>
          )}

          {shouldShowText && (
            <div
              className="flex h-full w-full items-center justify-center overflow-hidden text-center"
              style={{
                color: favorite.text.color.hex,
                fontFamily: favorite.font?.family || undefined,
                fontSize: `${Math.max(favorite.text.size * scaleFactor, 10)}px`,
              }}
            >
              {favorite.text.text.length > 12
                ? favorite.text.text.substring(0, 12) + "..."
                : favorite.text.text}
            </div>
          )}
        </div>

        {favorite.font?.family && <style>{fontCSS}</style>}
      </button>

      <div className="mt-2 text-center text-xs text-muted-foreground">
        {format(new Date(favorite.timestamp), "MMM d, yyyy")}
      </div>
    </div>
  );
}
