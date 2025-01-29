import { useRef, useState } from "react";
import { useWindowSize } from "usehooks-ts";
import { useBricks } from "./useBricks";
import { useBall } from "./useBall";
import { usePaddle } from "./usePaddle";

export function useBreakout(links: string[]) {
  const [gameOver, setGameOver] = useState(false);
  const scoreRef = useRef(0);
  const { width = 0, height = 0 } = useWindowSize();

  const { totalBricksRef, destroyedBricksRef, bricks } = useBricks(
    links.length
  );

  const { ballRef, updateBallSpeed, moveBall } = useBall();
  const { paddleRef, movePaddleTo } = usePaddle(width, height);

  function handleBrickCollisions() {
    bricks.forEach((brick) => {
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
        destroyedBricksRef.current += 1;
        updateBallSpeed(destroyedBricksRef.current, totalBricksRef.current);
      }
    });
  }

  function handleWallCollisions() {
    // Check left and right walls
    if (
      ballRef.current.hitbox.points.some((point) => point.x <= 0) ||
      ballRef.current.hitbox.points.some((point) => point.x >= width)
    ) {
      ballRef.current.dx = -ballRef.current.dx;
    }

    // Check ceiling
    if (ballRef.current.hitbox.points.some((point) => point.y <= 0)) {
      ballRef.current.dy = -ballRef.current.dy;
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
        ballRef.current.dy = -ballRef.current.dy;
      } else {
        setGameOver(true);
      }
    }
  }

  function updateGame() {
    if (gameOver) return;

    handleBrickCollisions();
    handleWallCollisions();

    // Move paddle to follow ball
    movePaddleTo(ballRef.current.x - paddleRef.current.width / 2);

    // Move ball
    moveBall(ballRef.current.dx, ballRef.current.dy);
  }

  return {
    gameOver,
    scoreRef,
    bricks,
    ballRef,
    paddleRef,
    totalBricksRef,
    destroyedBricksRef,
    updateGame,
  };
}
