import { useState, useEffect } from "react";
import { PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_SPEED } from "@/constants";

export const usePaddle = (canvasWidth: number) => {
  const [paddleX, setPaddleX] = useState(0);

  useEffect(() => {
    // Initialize paddle in the middle of the canvas
    setPaddleX((canvasWidth - PADDLE_WIDTH) / 2);
  }, [canvasWidth]);

  const movePaddle = (direction: "left" | "right") => {
    setPaddleX((prevX) => {
      const newX =
        direction === "left" ? prevX - PADDLE_SPEED : prevX + PADDLE_SPEED;

      // Keep paddle within canvas bounds
      return Math.max(0, Math.min(newX, canvasWidth - PADDLE_WIDTH));
    });
  };

  return {
    paddleX,
    setPaddleX,
    movePaddle,
  };
};
