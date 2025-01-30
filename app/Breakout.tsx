"use client";
import { useRef, useState } from "react";
import { useIsClient, useWindowSize } from "usehooks-ts";
import { MAX_BRICK_POINTS, useBricks } from "./hooks/useBricks";
import { useBall } from "./hooks/useBall";
import { usePaddle } from "./hooks/usePaddle";
import { useGameLoop } from "./hooks/useGameLoop";
import { useBreakoutFrame } from "./hooks/useBreakoutFrame";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
}

const links = ["/about", "/experience", "/connect"];

export default function Breakout({ children }: Props) {
  const [gameOver, setGameOver] = useState(false);
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
  });

  useGameLoop({
    isRunning: !gameOver,
    drawGame: drawFrame,
  });

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
              bricksRef.current = bricksRef.current.map((b) =>
                b === brick ? { ...b, visible: false } : b
              );
              scoreRef.current += brick.points;
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
