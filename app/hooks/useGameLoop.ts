import { useEffect, useRef, useCallback } from "react";
import { useIsClient } from "usehooks-ts";

interface GameLoopProps {
  isRunning: boolean;
  drawGame: () => void;
}

export function useGameLoop({ isRunning, drawGame }: GameLoopProps) {
  const isClient = useIsClient();
  const frameIdRef = useRef<number>(null);

  const gameLoop = useCallback(() => {
    drawGame();

    if (isRunning) {
      frameIdRef.current = requestAnimationFrame(gameLoop);
    }
  }, [isRunning, drawGame]);

  useEffect(() => {
    if (!isClient) return;

    frameIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [isClient, gameLoop]);
}
