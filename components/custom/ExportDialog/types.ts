import type { ExportPreset } from "@/lib/exportPresets";
import type { BatchExportProgress, BatchExportResult } from "@/lib/exportUtils";

export type ExportStep = "select" | "exporting" | "complete";

export interface PresetItemProps {
  preset: ExportPreset;
  checked: boolean;
  onToggle: () => void;
}

export interface ExportingStepProps {
  progress: BatchExportProgress;
}

export interface CompleteStepProps {
  results: BatchExportResult[];
  onClose: () => void;
}
