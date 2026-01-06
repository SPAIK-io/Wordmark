"use client";
import { ColorPickerField } from "@/components/custom/ColorPickerField";
import { NumberInputWithSlider } from "@/components/custom/NumberInputWithSlider";
import { SectionHeader } from "@/components/custom/SectionHeader";
import { LucideIconType } from "@/components/icons";
import { IconSelector } from "@/components/icons/IconSelector";
import { AIIconGenerator } from "@/components/ai";
import { TabsContent } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { iconAtom, aiIconAtom } from "@/lib/statemanager";
import { useAtom, useSetAtom } from "jotai";
import { Image, SlidersHorizontal, Sparkles, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function IconTab() {
  const [icon, setIcon] = useAtom(iconAtom);
  const setAiIcon = useSetAtom(aiIconAtom);
  const [aiOpen, setAiOpen] = useState(false);

  const handleIconSelect = (selectedIcon: string) => {
    // Clear AI icon when selecting a Lucide icon
    setAiIcon(null);
    setIcon((prev) => ({ ...prev, icon: selectedIcon as LucideIconType }));
  };

  return (
    <TabsContent value="icon" className="w-full overflow-y-auto p-0">
      <div className="flex flex-col gap-6 border-b p-4">
        {/* Section Header */}
        <SectionHeader
          title="Size & Color"
          icon={SlidersHorizontal}
          badge={`${icon.size}px`}
          description="Customize the appearance of your icon"
        />

        {/* Pick Icon Size */}
        <div className="grid gap-4">
          <NumberInputWithSlider
            id="icon-size"
            label="Icon Size"
            min={12}
            max={72}
            step={1}
            value={icon.size}
            unit="px"
            onChange={(value) => setIcon((prev) => ({ ...prev, size: value }))}
          />

          {/* Set Icon Color */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Icon Color</label>
            <ColorPickerField
              color={icon.color}
              onChange={(color) =>
                setIcon((prev) => ({ ...prev, color: color }))
              }
            />
          </div>
        </div>
      </div>

      {/* Pick Icon */}
      <div className="p-4">
        <SectionHeader
          title="Icon Selection"
          icon={Image}
          badge={
            icon.icon
              ? String(icon.icon).charAt(0).toUpperCase() +
                String(icon.icon).slice(1)
              : "None"
          }
          description="Browse and select an icon to include in your design"
          className="mb-4"
        />

        <IconSelector
          id="icon-picker"
          value={icon.icon}
          onChange={handleIconSelect}
        />
      </div>

      {/* AI Generated Section */}
      <div className="border-t p-4">
        <Collapsible open={aiOpen} onOpenChange={setAiOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <SectionHeader
              title="AI Generated"
              icon={Sparkles}
              badge="Beta"
              description="Generate custom logos with AI"
              className="flex-1"
            />
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform",
                aiOpen && "rotate-180"
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <AIIconGenerator />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </TabsContent>
  );
}
