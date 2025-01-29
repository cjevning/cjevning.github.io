import { useRef } from "react";

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  moveTo: (targetX: number, width: number) => void;
}

export function usePaddle(width: number, height: number) {
  const paddleRef = useRef<Paddle>({
    x: width / 2 - 50,
    y: height - 50,
    width: 100,
    height: 20,
    moveTo(targetX: number, canvasWidth: number) {
      this.x = Math.max(0, Math.min(canvasWidth - this.width, targetX));
    },
  });

  return paddleRef;
}
