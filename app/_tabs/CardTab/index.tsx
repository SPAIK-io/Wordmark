"use client";

import { ColorPickerField } from "@/components/custom/ColorPickerField";
import { SectionHeader } from "@/components/custom/SectionHeader";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { cardAtom } from "@/lib/statemanager";
import { useAtom } from "jotai";
import { LockIcon, Maximize, Square, UnlockIcon } from "lucide-react";
import { AspectRatioPresets } from "./AspectRatioPresets";
import { DimensionInput } from "./DimensionInput";
import { getCurrentRatioName } from "./types";
import { useDimensionHandlers } from "./useDimensionHandlers";

export function CardTab() {
  const [cardState, setCardState] = useAtom(cardAtom);
  const {
    handleInputChange,
    handleSliderChange,
    handleUnitChange,
    toggleRatioLock,
    applyAspectRatio,
  } = useDimensionHandlers(cardState, setCardState);

  const currentRatio = cardState.width.value / cardState.height.value;

  return (
    <TabsContent value="card" className="mt-0 h-full flex-1 overflow-auto p-0">
      <div className="flex flex-col gap-6 border-b p-4">
        <SectionHeader
          title="Background"
          icon={Square}
          badge={cardState.color.hex}
          description="Set the background color of your design"
        />

        <ColorPickerField
          color={cardState.color}
          onChange={(color) =>
            setCardState((prev) => ({ ...prev, color: color }))
          }
        />
      </div>

      <div className="flex flex-col gap-6 p-4">
        <SectionHeader
          title="Dimensions"
          icon={Maximize}
          badge={`${cardState.width.value}${cardState.width.unit} × ${cardState.height.value}${cardState.height.unit}`}
          description="Set the width and height of your design container"
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Dimensions</Label>
            <div className="flex items-center gap-2">
              <Label
                htmlFor="ratio-lock"
                className="text-xs text-muted-foreground"
              >
                Lock Ratio
              </Label>
              <Switch
                id="ratio-lock"
                checked={cardState.ratioLocked}
                onCheckedChange={toggleRatioLock}
              />
              {cardState.ratioLocked ? (
                <LockIcon size={16} className="text-primary" />
              ) : (
                <UnlockIcon size={16} className="text-muted-foreground" />
              )}
            </div>
          </div>

          <AspectRatioPresets
            ratioLocked={cardState.ratioLocked}
            currentRatio={currentRatio}
            onApplyRatio={applyAspectRatio}
            getCurrentRatioName={() => getCurrentRatioName(currentRatio)}
          />

          <div className="grid gap-4">
            <DimensionInput
              dimension="width"
              value={cardState.width.value}
              unit={cardState.width.unit}
              cardState={cardState}
              onValueChange={handleInputChange("width")}
              onSliderChange={handleSliderChange("width")}
              onUnitChange={handleUnitChange("width")}
            />

            <DimensionInput
              dimension="height"
              value={cardState.height.value}
              unit={cardState.height.unit}
              cardState={cardState}
              onValueChange={handleInputChange("height")}
              onSliderChange={handleSliderChange("height")}
              onUnitChange={handleUnitChange("height")}
            />
          </div>
        </div>
      </div>
    </TabsContent>
  );
}
