"use client";

import { LucideIconStatic } from "@/components/icons";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { LayoutVariants } from "../SelectableLayoutCard";
import {
  MIN_VERSION_CARD_HEIGHT,
  MIN_VERSION_CARD_WIDTH,
  VERSION_CARD_SCALE,
  VersionCardProps,
} from "./types";

export function VersionCard({ version, isActive, onClick }: VersionCardProps) {
  const scaleFactor = VERSION_CARD_SCALE;
  const width = Math.max(version.card.width.value * scaleFactor, MIN_VERSION_CARD_WIDTH);
  const height = Math.max(version.card.height.value * scaleFactor, MIN_VERSION_CARD_HEIGHT);
  const [fontCSS, setFontCSS] = useState<string | null>(null);

  useEffect(() => {
    if (version.font?.family) {
      const fetchFont = async () => {
        try {
          const res = await fetch(
            `https://fonts.googleapis.com/css?family=${version.font?.family.replace(" ", "+")}`,
          );
          const fontCss = await res.text();
          setFontCSS(fontCss);
        } catch (error) {
          console.error("Error fetching font for version history:", error);
        }
      };
      fetchFont();
    }
  }, [version.font?.family]);

  const getIconPosition = () => {
    const isHorizontal = version.layout === "ltr" || version.layout === "rtl";
    const isVertical = version.layout === "ttd" || version.layout === "dtt";

    return {
      top: isHorizontal ? "50%" : "30%",
      left: isVertical ? "50%" : version.layout === "ltr" ? "25%" : "75%",
      transform: "translate(-50%, -50%)",
    };
  };

  const shouldShowIcon = version.layout !== "text" && version.icon;
  const shouldShowText =
    version.layout !== "icon" && version.layout !== "circle" && version.text;

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={onClick}
        className={cn(
          "group relative flex flex-col transition-all",
          isActive
            ? "scale-105 ring-2 ring-primary"
            : "hover:ring-1 hover:ring-primary/50",
        )}
      >
        <div
          className={cn(
            LayoutVariants({ layout: version.layout }),
            "overflow-hidden rounded-md shadow-md",
            isActive ? "opacity-100" : "opacity-90 group-hover:opacity-100",
          )}
          style={{
            backgroundColor: version.card.color.hex,
            width: `${width}px`,
            height: `${height}px`,
            transform: "scale(1)",
            transition: "all 0.2s ease",
          }}
        >
          {shouldShowIcon && (
            <div
              className="absolute flex items-center justify-center"
              style={getIconPosition()}
            >
              <LucideIconStatic
                name={version.icon.icon}
                size={Math.max(version.icon.size * scaleFactor, 8)}
                style={{ color: version.icon.color.hex }}
              />
            </div>
          )}

          {shouldShowText && (
            <div
              className="flex h-full w-full items-center justify-center overflow-hidden text-center"
              style={{
                color: version.text.color.hex,
                fontFamily: version.font?.family || undefined,
                fontSize: `${Math.max(version.text.size * scaleFactor, 8)}px`,
              }}
            >
              {version.text.text.length > (width > 80 ? 10 : 6)
                ? version.text.text.substring(0, width > 80 ? 10 : 6) + "..."
                : version.text.text}
            </div>
          )}
        </div>

        <div
          className={cn(
            "absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border bg-background text-[10px] font-semibold",
            isActive ? "border-primary" : "border-muted-foreground/30",
          )}
        >
          {version.id}
        </div>

        {version.font?.family && <style>{fontCSS}</style>}
      </button>

      <div className="mt-1 text-[10px] text-muted-foreground">
        {format(new Date(version.timestamp), "HH:mm:ss")}
      </div>
    </div>
  );
}
