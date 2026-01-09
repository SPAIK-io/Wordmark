import type { IColor } from "react-color-palette";
import { Units } from "@/lib/constants";
import { ChangeEvent } from "react";

type UnitType = (typeof Units)[number];

export interface CardState {
  color: IColor;
  width: { value: number; unit: UnitType };
  height: { value: number; unit: UnitType };
  ratioLocked: boolean;
}

export type AspectRatio = {
  name: string;
  ratio: number; // width:height
};

export const COMMON_RATIOS: AspectRatio[] = [
  { name: "1:1", ratio: 1 },
  { name: "4:3", ratio: 4 / 3 },
  { name: "16:9", ratio: 16 / 9 },
  { name: "21:9", ratio: 21 / 9 },
  { name: "2:3", ratio: 2 / 3 },
  { name: "3:2", ratio: 3 / 2 },
];

export const RATIO_TOLERANCE = 0.01;

export const UNIT_DESCRIPTIONS: Record<string, string> = {
  px: "Pixels",
  "%": "Percent",
  em: "Font size units",
  rem: "Root font size units",
};

export type DimensionType = "width" | "height";

export interface DimensionInputProps {
  dimension: DimensionType;
  value: number;
  unit: string;
  cardState: CardState;
  onValueChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSliderChange: (value: number) => void;
  onUnitChange: (newUnit: (typeof Units)[number]) => void;
}

export interface AspectRatioPresetsProps {
  ratioLocked: boolean;
  currentRatio: number;
  onApplyRatio: (ratio: number) => void;
  getCurrentRatioName: () => string;
}

export function getUnitDescription(unit: string): string {
  return UNIT_DESCRIPTIONS[unit] || "Units";
}

export function matchesRatio(current: number, preset: number): boolean {
  return Math.abs(current - preset) < RATIO_TOLERANCE;
}

export function getCurrentRatioName(currentRatio: number): string {
  for (const preset of COMMON_RATIOS) {
    if (matchesRatio(currentRatio, preset.ratio)) {
      return preset.name;
    }
  }
  return `${currentRatio.toFixed(2)}:1`;
}
