"use client";

import { useState, useCallback } from "react";
import { useAtom } from "jotai";
import { Download, Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  EXPORT_PRESETS,
  PRESET_CATEGORIES,
  type PresetCategory,
} from "@/lib/exportPresets";
import { exportDialogOpenAtom } from "@/lib/statemanager";
import type { DownloadFormat } from "@/lib/types/design";
import {
  batchExport,
  downloadZip,
  expandPresetsToItems,
  type BatchExportProgress,
  type BatchExportResult,
} from "@/lib/exportUtils";
import { CompleteStep } from "./CompleteStep";
import { ExportingStep } from "./ExportingStep";
import { PresetItem } from "./PresetItem";
import type { ExportStep } from "./types";

interface ExportDialogProps {
  textContent?: string;
}

export function ExportDialog({ textContent = "" }: ExportDialogProps) {
  const [open, setOpen] = useAtom(exportDialogOpenAtom);
  const [step, setStep] = useState<ExportStep>("select");
  const [selectedPresets, setSelectedPresets] = useState<Set<string>>(new Set());
  const [selectedFormats, setSelectedFormats] = useState<Set<DownloadFormat>>(
    () => new Set<DownloadFormat>(["png"])
  );
  const [progress, setProgress] = useState<BatchExportProgress | null>(null);
  const [results, setResults] = useState<BatchExportResult[]>([]);

  const handlePresetToggle = useCallback((presetId: string) => {
    setSelectedPresets((prev) => {
      const next = new Set(prev);
      if (next.has(presetId)) {
        next.delete(presetId);
      } else {
        next.add(presetId);
      }
      return next;
    });
  }, []);

  const handleFormatToggle = useCallback((format: DownloadFormat) => {
    setSelectedFormats((prev) => {
      const next = new Set(prev);
      if (next.has(format)) {
        if (next.size > 1) {
          next.delete(format);
        }
      } else {
        next.add(format);
      }
      return next;
    });
  }, []);

  const handleSelectCategory = useCallback((category: PresetCategory) => {
    const categoryPresets = EXPORT_PRESETS.filter((p) => p.category === category);
    setSelectedPresets((prev) => {
      const next = new Set(prev);
      const allSelected = categoryPresets.every((p) => next.has(p.id));
      if (allSelected) {
        categoryPresets.forEach((p) => next.delete(p.id));
      } else {
        categoryPresets.forEach((p) => next.add(p.id));
      }
      return next;
    });
  }, []);

  const handleExport = useCallback(async () => {
    const previewElement = document.getElementById("display-card");
    if (!previewElement || selectedPresets.size === 0) return;

    setStep("exporting");
    setProgress({ current: 0, total: 0, currentItem: "Preparing..." });

    const presets = EXPORT_PRESETS.filter((p) => selectedPresets.has(p.id));
    const items = expandPresetsToItems(presets, Array.from(selectedFormats));

    try {
      const { blob, results } = await batchExport(
        previewElement,
        items,
        textContent,
        setProgress
      );

      setResults(results);
      setStep("complete");

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      downloadZip(blob, `spaik-export-${timestamp}.zip`);
    } catch (error) {
      console.error("Export failed:", error);
      setStep("select");
    }
  }, [selectedPresets, selectedFormats, textContent]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setTimeout(() => {
      setStep("select");
      setProgress(null);
      setResults([]);
    }, 200);
  }, [setOpen]);

  const groupedPresets = Object.entries(PRESET_CATEGORIES).map(
    ([category, label]) => ({
      category: category as PresetCategory,
      label,
      presets: EXPORT_PRESETS.filter((p) => p.category === category),
    })
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Batch Export
          </DialogTitle>
          <DialogDescription>
            Export your design in multiple sizes and formats at once.
          </DialogDescription>
        </DialogHeader>

        {step === "select" && (
          <>
            <Tabs defaultValue="internal-tools" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                {groupedPresets.map(({ category, label }) => (
                  <TabsTrigger key={category} value={category}>
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {groupedPresets.map(({ category, label, presets }) => (
                <TabsContent key={category} value={category}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{label}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSelectCategory(category)}
                      >
                        Toggle All
                      </Button>
                    </div>

                    <ScrollArea className="h-[200px]">
                      <div className="space-y-2">
                        {presets.map((preset) => (
                          <PresetItem
                            key={preset.id}
                            preset={preset}
                            checked={selectedPresets.has(preset.id)}
                            onToggle={() => handlePresetToggle(preset.id)}
                          />
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="space-y-3 border-t pt-4">
              <span className="text-sm font-medium">Formats</span>
              <div className="flex gap-4">
                {(["png", "svg", "jpeg"] as const).map((format) => (
                  <div key={format} className="flex items-center gap-2">
                    <Checkbox
                      id={`format-${format}`}
                      checked={selectedFormats.has(format)}
                      onCheckedChange={() => handleFormatToggle(format)}
                    />
                    <Label htmlFor={`format-${format}`} className="uppercase">
                      {format}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                disabled={selectedPresets.size === 0}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export {selectedPresets.size} preset
                {selectedPresets.size !== 1 ? "s" : ""}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "exporting" && progress && (
          <ExportingStep progress={progress} />
        )}

        {step === "complete" && (
          <CompleteStep results={results} onClose={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ExportDialog;
