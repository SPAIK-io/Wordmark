"use client";

import { useAtomValue } from "jotai";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { aiIconAtom } from "@/lib/statemanager";
import type { AIGeneratedIcon } from "@/lib/ai/types";

interface AIIconHistoryProps {
  history: AIGeneratedIcon[];
  onSelect: (icon: AIGeneratedIcon) => void;
}

export function AIIconHistory({ history, onSelect }: AIIconHistoryProps) {
  const currentAiIcon = useAtomValue(aiIconAtom);

  if (history.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>Recent generations</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {history.slice(0, 8).map((icon) => {
          const isSelected = currentAiIcon?.id === icon.id;

          return (
            <button
              key={icon.id}
              onClick={() => onSelect(icon)}
              className={cn(
                "group relative aspect-square overflow-hidden rounded-md border bg-white p-2 transition-all hover:border-primary",
                isSelected && "ring-2 ring-primary ring-offset-2"
              )}
              title={icon.prompt}
            >
              {/* Render PNG thumbnail for performance */}
              {icon.pngDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={icon.pngDataUrl}
                  alt={icon.prompt}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div
                  className="h-full w-full [&>svg]:h-full [&>svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: icon.svgData }}
                />
              )}

              {/* Style badge */}
              <span className="absolute bottom-0.5 right-0.5 rounded bg-black/50 px-1 text-[8px] capitalize text-white opacity-0 transition-opacity group-hover:opacity-100">
                {icon.style}
              </span>
            </button>
          );
        })}
      </div>

      {history.length > 8 && (
        <p className="text-center text-xs text-muted-foreground">
          +{history.length - 8} more
        </p>
      )}
    </div>
  );
}
