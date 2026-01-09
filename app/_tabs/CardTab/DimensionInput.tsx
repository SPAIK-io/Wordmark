"use client";

import { NumberInputWithSlider } from "@/components/custom/NumberInputWithSlider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Units } from "@/lib/constants";
import { DimensionInputProps, getUnitDescription } from "./types";

export function DimensionInput({
  dimension,
  value,
  unit,
  onValueChange,
  onSliderChange,
  onUnitChange,
}: DimensionInputProps) {
  const label = dimension === "width" ? "Width" : "Height";
  const id = dimension;
  const sliderId = `${dimension}-slider`;

  return (
    <div className="space-y-2 rounded-md bg-muted/20 p-3">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        <div className="flex items-center">
          <div className="flex h-8 items-center rounded bg-muted/30 pr-0">
            <input
              id={id}
              type="number"
              className="h-full w-16 bg-transparent pl-2 text-xs focus:outline-none"
              min={1}
              value={value}
              onChange={onValueChange}
              aria-label={`${label} value`}
            />
            <Select
              value={unit}
              onValueChange={(val) =>
                onUnitChange(val as (typeof Units)[number])
              }
            >
              <SelectTrigger
                className="h-8 w-14 border-0 bg-transparent pl-1 pr-1 text-xs focus:ring-0"
                aria-label={`${label} unit`}
              >
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                {Units.map((u: string) => (
                  <SelectItem key={u} value={u} className="text-xs">
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <NumberInputWithSlider
        id={sliderId}
        min={1}
        max={1000}
        step={1}
        value={value}
        onChange={onSliderChange}
      />
      <div className="text-right text-xs text-muted-foreground">
        {getUnitDescription(unit)}
      </div>
    </div>
  );
}
