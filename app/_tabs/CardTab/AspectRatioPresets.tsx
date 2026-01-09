"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AspectRatioPresetsProps, COMMON_RATIOS, matchesRatio } from "./types";

export function AspectRatioPresets({
  ratioLocked,
  currentRatio,
  onApplyRatio,
  getCurrentRatioName,
}: AspectRatioPresetsProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">Aspect Ratio</Label>
      <div className="flex flex-wrap gap-2">
        {COMMON_RATIOS.map((ratioOption) => (
          <Button
            key={ratioOption.name}
            variant={
              ratioLocked && matchesRatio(currentRatio, ratioOption.ratio)
                ? "default"
                : "outline"
            }
            size="sm"
            className="h-8 text-xs"
            onClick={() => onApplyRatio(ratioOption.ratio)}
          >
            {ratioOption.name}
          </Button>
        ))}
      </div>
      {ratioLocked && (
        <div className="text-xs text-muted-foreground">
          Current ratio: {getCurrentRatioName()}
        </div>
      )}
    </div>
  );
}
