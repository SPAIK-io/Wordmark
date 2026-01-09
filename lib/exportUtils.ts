"use client";

import { toPng, toSvg, toJpeg } from "html-to-image";
import type { Options } from "html-to-image/lib/types";
import JSZip from "jszip";
import type {
  DownloadFormat,
  ExportPreset,
  ExportOptions,
  BatchExportItem,
} from "./types/design";

// ============================================
// Single Export Utilities
// ============================================

const DEFAULT_PIXEL_RATIO = 2;
const DEFAULT_JPEG_QUALITY = 0.95;

interface ToImageOptions extends Options {
  format: DownloadFormat;
}

/**
 * Convert a DOM node to an image data URL
 */
export async function toImage(
  node: HTMLElement,
  options: ToImageOptions
): Promise<string> {
  const { format, ...imageOptions } = options;

  switch (format) {
    case "png":
      return toPng(node, imageOptions);
    case "svg":
      return toSvg(node, imageOptions);
    case "jpeg":
      return toJpeg(node, {
        ...imageOptions,
        quality: DEFAULT_JPEG_QUALITY,
      });
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

/**
 * Generate a sanitized filename from text content
 */
export function generateFilename(
  text: string,
  format: DownloadFormat,
  prefix = "spaik"
): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const sanitizedText = text
    .trim()
    .replace(/[/\\?%*:|"<>]/g, "-")
    .substring(0, 30);

  const textPart = sanitizedText || prefix;
  return `${prefix}-${textPart}-${timestamp}.${format}`;
}

/**
 * Export a single image with given options
 */
export async function exportImage(
  node: HTMLElement,
  options: ExportOptions
): Promise<{ dataUrl: string; filename: string }> {
  const {
    format,
    scale = DEFAULT_PIXEL_RATIO,
    filename,
    backgroundColor,
  } = options;

  const dataUrl = await toImage(node, {
    format,
    cacheBust: true,
    pixelRatio: scale,
    backgroundColor,
  });

  const finalFilename = filename || generateFilename("export", format);

  return { dataUrl, filename: finalFilename };
}

/**
 * Trigger a download of a data URL
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

// ============================================
// Batch Export Utilities
// ============================================

export interface BatchExportProgress {
  current: number;
  total: number;
  currentItem: string;
}

export interface BatchExportResult {
  success: boolean;
  filename: string;
  error?: string;
}

/**
 * Export multiple presets/formats as a ZIP file
 */
export async function batchExport(
  node: HTMLElement,
  items: BatchExportItem[],
  textContent: string,
  onProgress?: (progress: BatchExportProgress) => void
): Promise<{ blob: Blob; results: BatchExportResult[] }> {
  const zip = new JSZip();
  const results: BatchExportResult[] = [];
  const total = items.length;

  for (let i = 0; i < items.length; i++) {
    const { preset, format } = items[i];
    const itemName = `${preset.name} (${format.toUpperCase()})`;

    onProgress?.({
      current: i + 1,
      total,
      currentItem: itemName,
    });

    try {
      // Generate filename based on preset
      const filename = `${preset.id}-${preset.dimensions.width}x${preset.dimensions.height}.${format}`;

      // Calculate scale based on preset dimensions vs current node dimensions
      const currentWidth = node.offsetWidth;
      const scale = Math.max(
        1,
        Math.ceil(preset.dimensions.width / currentWidth)
      );

      const dataUrl = await toImage(node, {
        format,
        cacheBust: true,
        pixelRatio: scale,
      });

      // Convert data URL to blob for zip
      const base64Data = dataUrl.split(",")[1];
      zip.file(filename, base64Data, { base64: true });

      results.push({ success: true, filename });
    } catch (error) {
      results.push({
        success: false,
        filename: `${preset.id}.${format}`,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  const blob = await zip.generateAsync({ type: "blob" });

  return { blob, results };
}

/**
 * Download a ZIP blob
 */
export function downloadZip(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Get file extension from format
 */
export function getExtension(format: DownloadFormat): string {
  return format;
}

/**
 * Get MIME type from format
 */
export function getMimeType(format: DownloadFormat): string {
  switch (format) {
    case "png":
      return "image/png";
    case "svg":
      return "image/svg+xml";
    case "jpeg":
      return "image/jpeg";
    default:
      return "application/octet-stream";
  }
}

// ============================================
// Preset Expansion Utilities
// ============================================

/**
 * Expand presets into batch export items based on their supported formats
 */
export function expandPresetsToItems(
  presets: ExportPreset[],
  selectedFormats: DownloadFormat[]
): BatchExportItem[] {
  const items: BatchExportItem[] = [];

  for (const preset of presets) {
    // Use intersection of preset formats and selected formats
    const formats = preset.formats.filter((f) =>
      selectedFormats.includes(f as DownloadFormat)
    );

    for (const format of formats) {
      items.push({
        preset,
        format: format as DownloadFormat,
      });
    }
  }

  return items;
}
