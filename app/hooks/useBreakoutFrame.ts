import { RefObject, MutableRefObject } from "react";
import { Ball } from "./useBall";
import { Brick } from "./useBricks";
import { Paddle } from "./usePaddle";
import { drawGame as drawBreakoutGame } from "../game/draw";
import { useWindowSize } from "usehooks-ts";

interface BreakoutFrameProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  ballRef: MutableRefObject<Ball>;
  paddleRef: MutableRefObject<Paddle>;
  bricksRef: MutableRefObject<Brick[]>;
  scoreRef: MutableRefObject<number>;
  setGameOver: (value: boolean) => void;
  width: number;
}

export function useBreakoutFrame({
  canvasRef,
  ballRef,
  paddleRef,
  bricksRef,
  scoreRef,
  setGameOver,
  width,
}: BreakoutFrameProps) {
  const { height = 0 } = useWindowSize();
  const BASE_SPEED = 7;

  function handleBrickCollisions() {
    bricksRef.current.forEach((brick) => {
      if (!brick.visible) return;

      const collision = ballRef.current.hitbox.points.some(
        (point) =>
          point.x >= brick.x &&
          point.x <= brick.x + brick.width &&
          point.y >= brick.y &&
          point.y <= brick.y + brick.height
      );

      if (collision) {
        const relativeX = (ballRef.current.x - brick.x) / brick.width;
        const relativeY = (ballRef.current.y - brick.y) / brick.height;

        if (
          Math.min(relativeX, 1 - relativeX) <
          Math.min(relativeY, 1 - relativeY)
        ) {
          ballRef.current.dx = -ballRef.current.dx;
        } else {
          ballRef.current.dy = -ballRef.current.dy;
        }

        brick.visible = false;
        scoreRef.current += brick.points;

        // Update ball speed based on progress
        const totalBricks = bricksRef.current.length;
        const destroyedBricks = bricksRef.current.filter(
          (b) => !b.visible
        ).length;
        const progress = destroyedBricks / totalBricks;
        const speedMultiplier = 1 + progress * 0.5;

        ballRef.current = {
          ...ballRef.current,
          dx: Math.sign(ballRef.current.dx) * BASE_SPEED * speedMultiplier,
          dy: Math.sign(ballRef.current.dy) * BASE_SPEED * speedMultiplier,
        };
      }
    });
  }

  function handleWallCollisions(canvas: HTMLCanvasElement) {
    // Check left and right walls
    if (
      ballRef.current.hitbox.points.some((point) => point.x <= 0) ||
      ballRef.current.hitbox.points.some((point) => point.x >= canvas.width)
    ) {
      ballRef.current = {
        ...ballRef.current,
        dx: -ballRef.current.dx,
        hitbox: ballRef.current.calculateHitbox({
          x: ballRef.current.x,
          y: ballRef.current.y,
        }),
      };
    }

    // Check ceiling
    if (ballRef.current.hitbox.points.some((point) => point.y <= 0)) {
      ballRef.current = {
        ...ballRef.current,
        dy: -ballRef.current.dy,
        hitbox: ballRef.current.calculateHitbox({
          x: ballRef.current.x,
          y: ballRef.current.y,
        }),
      };
    }

    // Check paddle/floor
    if (
      ballRef.current.hitbox.points.some(
        (point) => point.y > height - paddleRef.current.height - 30
      )
    ) {
      if (
        ballRef.current.hitbox.points.some(
          (point) =>
            point.x > paddleRef.current.x &&
            point.x < paddleRef.current.x + paddleRef.current.width
        )
      ) {
        ballRef.current = {
          ...ballRef.current,
          dy: -ballRef.current.dy,
          hitbox: ballRef.current.calculateHitbox({
            x: ballRef.current.x,
            y: ballRef.current.y,
          }),
        };
      } else {
        setGameOver(true);
      }
    }
  }

  function handlePaddleMovement(position: { x: number }) {
    paddleRef.current.moveTo(position.x - paddleRef.current.width / 2, width);
  }

  const drawFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    handleBrickCollisions();
    handleWallCollisions(canvas);
    handlePaddleMovement({ x: ballRef.current.x });

    // Move ball
    const newX = ballRef.current.x + ballRef.current.dx;
    const newY = ballRef.current.y + ballRef.current.dy;
    ballRef.current = {
      ...ballRef.current,
      x: newX,
      y: newY,
      hitbox: ballRef.current.calculateHitbox({ x: newX, y: newY }),
    };

    // Draw the game state
    drawBreakoutGame({
      ctx,
      canvas,
      ball: ballRef.current,
      paddle: paddleRef.current,
      bricks: bricksRef.current,
      score: scoreRef.current,
      destroyedBricks: bricksRef.current.filter((b) => !b.visible).length,
      totalBricks: bricksRef.current.length,
    });
  };

  return { drawFrame };
}
