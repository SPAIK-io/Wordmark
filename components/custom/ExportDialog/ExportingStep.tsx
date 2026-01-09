"use client";

import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ExportingStepProps } from "./types";

export function ExportingStep({ progress }: ExportingStepProps) {
  const percentage = progress.total > 0
    ? (progress.current / progress.total) * 100
    : 0;

  return (
    <div className="space-y-4 py-8">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">
          Exporting {progress.current} of {progress.total}...
        </p>
        <p className="text-xs text-muted-foreground">{progress.currentItem}</p>
      </div>
      <Progress value={percentage} />
    </div>
  );
}
