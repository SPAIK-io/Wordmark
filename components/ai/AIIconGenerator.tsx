"use client";

import { useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  aiIconAtom,
  aiGenerationAtom,
  aiIconHistoryAtom,
  iconAtom,
} from "@/lib/statemanager";
import type {
  AIIconStyle,
  GenerateLogoResponse,
  VectorizeResponse,
} from "@/lib/ai/types";
import { AIIconHistory } from "./AIIconHistory";

const STYLE_OPTIONS: { value: AIIconStyle; label: string }[] = [
  { value: "minimal", label: "Minimal" },
  { value: "geometric", label: "Geometric" },
  { value: "abstract", label: "Abstract" },
  { value: "icon", label: "Flat Icon" },
];

export function AIIconGenerator() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<AIIconStyle>("minimal");

  const [generation, setGeneration] = useAtom(aiGenerationAtom);
  const [history, setHistory] = useAtom(aiIconHistoryAtom);
  const setAiIcon = useSetAtom(aiIconAtom);
  const setIcon = useSetAtom(iconAtom);

  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({ variant: "destructive", title: "Enter a prompt" });
      return;
    }

    setGeneration({ isLoading: true, error: null, progress: "generating" });

    try {
      // Step 1: Generate PNG via OpenAI
      const genResponse = await fetch("/api/ai/generate-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), style }),
      });

      const genData: GenerateLogoResponse = await genResponse.json();

      if (!genData.success || !genData.image) {
        throw new Error(genData.error || "Generation failed");
      }

      setGeneration((prev) => ({ ...prev, progress: "converting" }));

      // Step 2: Convert PNG to SVG via Recraft
      const vecResponse = await fetch("/api/ai/vectorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: genData.image }),
      });

      const vecData: VectorizeResponse = await vecResponse.json();

      if (!vecData.success || !vecData.svg) {
        throw new Error(vecData.error || "Vectorization failed");
      }

      // Step 3: Create icon object and save
      const newIcon = {
        id: `ai-${Date.now()}`,
        prompt: prompt.trim(),
        style,
        svgData: vecData.svg,
        pngDataUrl: `data:image/png;base64,${genData.image}`,
        createdAt: Date.now(),
      };

      // Clear Lucide icon selection when using AI icon
      setIcon((prev) => ({ ...prev, icon: "" as typeof prev.icon }));
      setAiIcon(newIcon);

      // Add to history (keep last 20)
      setHistory((prev) => [newIcon, ...prev.slice(0, 19)]);

      setGeneration({ isLoading: false, error: null, progress: "complete" });
      toast({ title: "Logo generated!", description: "SVG ready for use" });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate logo";
      setGeneration({ isLoading: false, error: message, progress: "idle" });
      toast({ variant: "destructive", title: "Error", description: message });
    }
  };

  const handleSelectFromHistory = (icon: (typeof history)[0]) => {
    setIcon((prev) => ({ ...prev, icon: "" as typeof prev.icon }));
    setAiIcon(icon);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Prompt Input */}
      <Textarea
        placeholder="Describe your logo (e.g., 'A modern rocket ship' or 'Abstract brain with circuits')"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={generation.isLoading}
        className="min-h-[80px] resize-none"
        maxLength={500}
      />

      {/* Style Selector */}
      <div className="flex flex-wrap gap-2">
        {STYLE_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={style === opt.value ? "default" : "outline"}
            size="sm"
            onClick={() => setStyle(opt.value)}
            disabled={generation.isLoading}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={generation.isLoading || !prompt.trim()}
        className="w-full"
      >
        {generation.isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {generation.progress === "generating"
              ? "Generating..."
              : "Converting to SVG..."}
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Logo
          </>
        )}
      </Button>

      {/* History */}
      {history.length > 0 && (
        <AIIconHistory history={history} onSelect={handleSelectFromHistory} />
      )}
    </div>
  );
}
