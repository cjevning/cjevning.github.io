import { useRef } from "react";

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function usePaddle(width: number, height: number) {
  const paddleRef = useRef<Paddle>({
    x: width / 2 - 50,
    y: height - 50,
    width: 100,
    height: 20,
  });

  const movePaddleTo = (targetX: number) => {
    const newX = Math.max(
      0,
      Math.min(width - paddleRef.current.width, targetX)
    );
    paddleRef.current = {
      ...paddleRef.current,
      x: newX,
    };
  };

  return {
    paddleRef,
    movePaddleTo,
  };
}
