"use client";
import { useEffect, useRef, useState } from "react";
import { useIsClient, useWindowSize } from "usehooks-ts";
import { MAX_BRICK_POINTS, useBricks } from "./hooks/useBricks";
import { useBall } from "./hooks/useBall";
import { usePaddle } from "./hooks/usePaddle";
import { useGameLoop } from "./hooks/useGameLoop";
import { useBreakoutFrame } from "./hooks/useBreakoutFrame";
import Link from "next/link";
import { useScoreIndicators } from "./hooks/useScoreIndicators";

interface Props {
  children: React.ReactNode;
}

const links = ["/about", "/experience", "/connect"];

export default function Breakout({ children }: Props) {
  const [gameOver, setGameOver] = useState(false);
  const { indicators, addIndicator, updateIndicators } = useScoreIndicators();
  const scoreRef = useRef(0);
  const isClient = useIsClient();
  const { width = 0, height = 0 } = useWindowSize();

  const bricksRef = useBricks(links.length);
  const paddleRef = usePaddle();
  const ballRef = useBall();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { drawFrame } = useBreakoutFrame({
    canvasRef,
    ballRef,
    paddleRef,
    bricksRef,
    scoreRef,
    setGameOver,
    indicators,
    addIndicator,
    updateIndicators,
  });

  useGameLoop({
    isRunning: !gameOver,
    drawGame: drawFrame,
  });

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;

      const ratio =
        typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

      // get current size of the canvas
      const rect = canvas.getBoundingClientRect();

      // get width and height
      const { width, height } = rect;
      console.log(ratio);

      canvas.width = width * ratio;
      canvas.height = height * ratio;

      // 2. Force it to display at the original (logical) size with CSS or style attributes
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";

      // 3. Scale the context so you can draw on it without considering the ratio.
      ctx.scale(ratio, ratio);
    }
  }, []);

  if (!isClient) {
    return null;
  }

  const topRowBricks = bricksRef.current.filter(
    (brick) => brick.points === MAX_BRICK_POINTS
  );
  const middleTopBricks = topRowBricks.slice(
    Math.floor((topRowBricks.length - links.length) / 2),
    Math.floor((topRowBricks.length - links.length) / 2) + links.length
  );

  return (
    <div className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full"
      />
      <nav>
        {links.map((link, index) => (
          <Link
            key={link}
            href={link}
            className="absolute flex items-center justify-center"
            style={{
              left: middleTopBricks[index].x,
              top: middleTopBricks[index].y,
              width: middleTopBricks[index].width,
              height: middleTopBricks[index].height,
            }}
            onClick={() => {
              const brick = middleTopBricks[index];
              if (brick.visible) {
                scoreRef.current += brick.points;
                addIndicator(
                  brick.x + brick.width / 2,
                  brick.y + brick.height / 2,
                  brick.points
                );
                bricksRef.current = bricksRef.current.map((b) =>
                  b === brick ? { ...b, visible: false } : b
                );
              }
            }}
          >
            {link.replace("/", "")}
          </Link>
        ))}
      </nav>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full p-4 text-left text-sm md:text-base md:max-w-[600px]">
        {children}
      </div>
    </div>
  );
}
