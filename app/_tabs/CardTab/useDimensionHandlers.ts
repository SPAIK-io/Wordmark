import { Units } from "@/lib/constants";
import { ChangeEvent, useCallback } from "react";
import { CardState } from "./types";

type SetCardState = (fn: (prev: CardState) => CardState) => void;

export function useDimensionHandlers(
  cardState: CardState,
  setCardState: SetCardState,
) {
  const handleDimensionChange = useCallback(
    (dimension: "width" | "height", newValue: number) => {
      const isWidth = dimension === "width";
      const otherDimension = isWidth ? "height" : "width";

      if (
        cardState.ratioLocked &&
        cardState.width.unit === cardState.height.unit
      ) {
        const ratio = isWidth
          ? cardState.height.value / cardState.width.value
          : cardState.width.value / cardState.height.value;
        const newOtherValue = Math.round(newValue * ratio);

        setCardState((prev) => ({
          ...prev,
          [dimension]: { ...prev[dimension], value: newValue },
          [otherDimension]: { ...prev[otherDimension], value: newOtherValue },
        }));
      } else {
        setCardState((prev) => ({
          ...prev,
          [dimension]: { ...prev[dimension], value: newValue },
        }));
      }
    },
    [cardState, setCardState],
  );

  const handleInputChange = useCallback(
    (dimension: "width" | "height") =>
      (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === "") return;
        const value = parseInt(e.target.value);
        if (isNaN(value)) return;
        handleDimensionChange(dimension, value);
      },
    [handleDimensionChange],
  );

  const handleSliderChange = useCallback(
    (dimension: "width" | "height") => (value: number) => {
      handleDimensionChange(dimension, value);
    },
    [handleDimensionChange],
  );

  const handleUnitChange = useCallback(
    (dimension: "width" | "height") =>
      (newUnit: (typeof Units)[number]) => {
        if (cardState.ratioLocked) {
          setCardState((prev) => ({
            ...prev,
            width: { ...prev.width, unit: newUnit },
            height: { ...prev.height, unit: newUnit },
          }));
        } else {
          setCardState((prev) => ({
            ...prev,
            [dimension]: { ...prev[dimension], unit: newUnit },
          }));
        }
      },
    [cardState.ratioLocked, setCardState],
  );

  const toggleRatioLock = useCallback(() => {
    setCardState((prev) => ({
      ...prev,
      ratioLocked: !prev.ratioLocked,
    }));
  }, [setCardState]);

  const applyAspectRatio = useCallback(
    (ratio: number) => {
      const newHeight = Math.round(cardState.width.value / ratio);
      setCardState((prev) => ({
        ...prev,
        height: { ...prev.height, value: newHeight },
        ratioLocked: true,
      }));
    },
    [cardState.width.value, setCardState],
  );

  return {
    handleInputChange,
    handleSliderChange,
    handleUnitChange,
    toggleRatioLock,
    applyAspectRatio,
  };
}
