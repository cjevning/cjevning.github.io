"use client";
import { useRef, useState } from "react";
import { useWindowSize, useIsClient } from "usehooks-ts";
import { MAX_BRICK_POINTS, useBricks } from "./hooks/useBricks";
import { useBall } from "./hooks/useBall";
import { usePaddle } from "./hooks/usePaddle";
import { useGameLoop } from "./hooks/useGameLoop";
import { useBreakoutLogic } from "./hooks/useBreakoutLogic";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
}

const links = ["/about", "/experience", "/connect"];

export default function Breakout({ children }: Props) {
  const [gameOver, setGameOver] = useState(false);
  const scoreRef = useRef(0);
  const { width = 0, height = 0 } = useWindowSize();
  const isClient = useIsClient();

  // const [navLinks, setNavLinks] = useState<
  //   Array<{
  //     x: number;
  //     y: number;
  //     width: number;
  //     height: number;
  //     link: string;
  //     visible: boolean;
  //   }>
  // >([]);

  const {
    totalBricksRef,
    destroyedBricksRef,
    bricks,
    // updateNavLinks
  } = useBricks(links.length);
  const { paddleRef, movePaddleTo } = usePaddle(width, height);
  const { ballRef, updateBallSpeed, moveBall } = useBall();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { drawGame } = useBreakoutLogic({
    canvasRef,
    ballRef,
    moveBall,
    paddleRef,
    bricks,
    movePaddleTo,
    updateBallSpeed,
    destroyedBricksRef,
    totalBricksRef,
    scoreRef,
    setGameOver,
  });

  useGameLoop({
    isRunning: !gameOver,
    drawGame,
  });

  if (!isClient) {
    return null;
  }

  const topRowBricks = bricks.filter(
    (brick) => brick.points === MAX_BRICK_POINTS
  );
  const middleTopBricks = topRowBricks.slice(
    Math.floor((topRowBricks.length - links.length) / 2),
    Math.floor((topRowBricks.length - links.length) / 2) + links.length
  );

  return (
    <div className="w-screen h-screen relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full"
      />
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
        >
          {link.replace("/", "")}
        </Link>
      ))}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-7">
        {children}
      </div>
    </div>
  );
}
