import { useRef } from "react";
import { useWindowSize } from "usehooks-ts";

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  moveTo: (targetX: number, width: number) => void;
}

export function usePaddle() {
  const { width = 0, height = 0 } = useWindowSize();
  const paddleRef = useRef<Paddle>({
    x: width / 2 - 50,
    y: height - 50,
    width: width / 10,
    height: 20,
    moveTo(targetX: number, canvasWidth: number) {
      this.x = Math.max(0, Math.min(canvasWidth - this.width, targetX));
    },
  });

  return paddleRef;
}
