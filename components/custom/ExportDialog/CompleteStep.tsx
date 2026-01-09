"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { CompleteStepProps } from "./types";

export function CompleteStep({ results, onClose }: CompleteStepProps) {
  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  return (
    <div className="space-y-4 py-8">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="mt-4 font-semibold">Export Complete</h3>
        <p className="text-sm text-muted-foreground">
          {successCount} files exported successfully
          {failCount > 0 && `, ${failCount} failed`}
        </p>
      </div>

      {failCount > 0 && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
          <p className="text-sm font-medium text-destructive">Failed exports:</p>
          <ul className="mt-2 text-xs text-muted-foreground">
            {results
              .filter((r) => !r.success)
              .map((r) => (
                <li key={r.filename} className="flex items-center gap-2">
                  <X className="h-3 w-3 text-destructive" />
                  {r.filename}: {r.error}
                </li>
              ))}
          </ul>
        </div>
      )}

      <DialogFooter>
        <Button onClick={onClose}>Done</Button>
      </DialogFooter>
    </div>
  );
}
