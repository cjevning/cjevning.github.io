import { useState, useCallback } from "react";

export interface ScoreIndicator {
  x: number;
  y: number;
  value: number;
  opacity: number;
  frame: number;
  initialX: number;
}

export function useScoreIndicators() {
  const [indicators, setIndicators] = useState<ScoreIndicator[]>([]);

  const addIndicator = useCallback((x: number, y: number, value: number) => {
    setIndicators((prev) => [
      ...prev,
      {
        x,
        y,
        value,
        opacity: 1,
        frame: 0,
        initialX: x, // Store initial x position
      },
    ]);
  }, []);

  const updateIndicators = useCallback(() => {
    setIndicators((prev) =>
      prev
        .map((indicator) => {
          // Slower upward movement
          const newY = indicator.y - 0.5;

          // Sine wave for horizontal movement
          // Amplitude of 15 pixels, frequency adjusted by /20
          const newX = indicator.initialX + Math.sin(indicator.frame / 20) * 15;

          // Slower fade out (changed from 60 to 120 frames)
          const newOpacity = 1 - indicator.frame / 120;

          return {
            ...indicator,
            x: newX,
            y: newY,
            opacity: newOpacity,
            frame: indicator.frame + 1,
          };
        })
        .filter((indicator) => indicator.opacity > 0)
    );
  }, []);

  return {
    indicators,
    addIndicator,
    updateIndicators,
  };
}
