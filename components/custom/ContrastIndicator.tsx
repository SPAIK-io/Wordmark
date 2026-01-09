"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { IColor } from "react-color-palette";
import {
  analyzeContrast,
  getContrastRating,
  formatContrastRatio,
} from "@/lib/colorUtils";

interface ContrastIndicatorProps {
  foreground: IColor;
  background: IColor;
  showDetails?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ContrastIndicator({
  foreground,
  background,
  showDetails = false,
  size = "md",
  className,
}: ContrastIndicatorProps) {
  const contrast = useMemo(
    () => analyzeContrast(foreground, background),
    [foreground, background]
  );

  const rating = useMemo(
    () => getContrastRating(contrast.ratio),
    [contrast.ratio]
  );

  const sizeClasses = {
    sm: "text-xs gap-1",
    md: "text-sm gap-2",
    lg: "text-base gap-3",
  };

  const badgeSizeClasses = {
    sm: "px-1 py-0.5 text-[10px]",
    md: "px-1.5 py-0.5 text-xs",
    lg: "px-2 py-1 text-sm",
  };

  const levelColors = {
    AAA: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400",
    AA: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400",
    fail: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400",
  };

  return (
    <div className={cn("flex items-center", sizeClasses[size], className)}>
      <div className="flex items-center gap-1">
        <span className="font-mono">{formatContrastRatio(contrast.ratio)}</span>
        <span
          className={cn(
            "rounded font-medium",
            badgeSizeClasses[size],
            levelColors[contrast.level]
          )}
        >
          {contrast.level === "fail" ? "Fail" : contrast.level}
        </span>
      </div>

      {showDetails && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>{rating.emoji}</span>
          <span>{rating.label}</span>
        </div>
      )}
    </div>
  );
}

interface ContrastCheckerProps {
  foreground: IColor;
  background: IColor;
  className?: string;
}

export function ContrastChecker({
  foreground,
  background,
  className,
}: ContrastCheckerProps) {
  const contrast = useMemo(
    () => analyzeContrast(foreground, background),
    [foreground, background]
  );

  const rating = useMemo(
    () => getContrastRating(contrast.ratio),
    [contrast.ratio]
  );

  return (
    <div className={cn("rounded-lg border p-4 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Contrast Check</h4>
        <ContrastIndicator foreground={foreground} background={background} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ColorSwatch color={foreground} label="Text" />
        <ColorSwatch color={background} label="Background" />
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{rating.description}</p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <ComplianceRow
            label="AA Normal Text"
            passes={contrast.passes.AA.normal}
            threshold="4.5:1"
          />
          <ComplianceRow
            label="AA Large Text"
            passes={contrast.passes.AA.large}
            threshold="3:1"
          />
          <ComplianceRow
            label="AAA Normal Text"
            passes={contrast.passes.AAA.normal}
            threshold="7:1"
          />
          <ComplianceRow
            label="AAA Large Text"
            passes={contrast.passes.AAA.large}
            threshold="4.5:1"
          />
        </div>
      </div>

      <div
        className="rounded-md p-4 text-center"
        style={{ backgroundColor: background.hex, color: foreground.hex }}
      >
        <p className="font-medium">Sample Text Preview</p>
        <p className="text-sm">The quick brown fox jumps over the lazy dog.</p>
      </div>
    </div>
  );
}

interface ColorSwatchProps {
  color: IColor;
  label: string;
}

function ColorSwatch({ color, label }: ColorSwatchProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-8 w-8 rounded border"
        style={{ backgroundColor: color.hex }}
      />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-mono text-sm">{color.hex}</p>
      </div>
    </div>
  );
}

interface ComplianceRowProps {
  label: string;
  passes: boolean;
  threshold: string;
}

function ComplianceRow({ label, passes, threshold }: ComplianceRowProps) {
  return (
    <div className="flex items-center justify-between rounded bg-muted/50 px-2 py-1">
      <span>{label}</span>
      <span className="flex items-center gap-1">
        <span className="text-muted-foreground">{threshold}</span>
        {passes ? (
          <span className="text-green-600 dark:text-green-400">✓</span>
        ) : (
          <span className="text-red-600 dark:text-red-400">✗</span>
        )}
      </span>
    </div>
  );
}

interface InlineContrastBadgeProps {
  foreground: IColor;
  background: IColor;
  className?: string;
}

export function InlineContrastBadge({
  foreground,
  background,
  className,
}: InlineContrastBadgeProps) {
  const contrast = useMemo(
    () => analyzeContrast(foreground, background),
    [foreground, background]
  );

  const bgColor = {
    AAA: "bg-green-500",
    AA: "bg-yellow-500",
    fail: "bg-red-500",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium text-white",
        bgColor[contrast.level],
        className
      )}
    >
      {contrast.ratio.toFixed(1)}:1
    </div>
  );
}

export default ContrastIndicator;
