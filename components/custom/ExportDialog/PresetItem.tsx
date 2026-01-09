"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { PresetItemProps } from "./types";

export function PresetItem({ preset, checked, onToggle }: PresetItemProps) {
  return (
    <div
      className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
      onClick={onToggle}
    >
      <Checkbox checked={checked} onCheckedChange={onToggle} />
      <div className="flex-1">
        <p className="text-sm font-medium">{preset.name}</p>
        <p className="text-xs text-muted-foreground">
          {preset.dimensions.width} × {preset.dimensions.height}px
        </p>
      </div>
      <div className="flex gap-1">
        {preset.formats.map((format) => (
          <span
            key={format}
            className="rounded bg-muted px-1.5 py-0.5 text-xs uppercase"
          >
            {format}
          </span>
        ))}
      </div>
    </div>
  );
}
