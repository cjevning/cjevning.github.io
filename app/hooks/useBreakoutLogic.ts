import { useRef, RefObject, MutableRefObject } from "react";
import { Ball } from "./useBall";
import { Brick } from "./useBricks";
import { Paddle } from "./usePaddle";
import { drawGame as drawBreakoutGame } from "../game/draw";
import { useWindowSize } from "usehooks-ts";

interface BreakoutLogicProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  ballRef: MutableRefObject<Ball>;
  moveBall: (dx: number, dy: number) => void;
  paddleRef: MutableRefObject<Paddle>;
  bricks: Brick[];
  movePaddleTo: (x: number) => void;
  updateBallSpeed: (destroyedBricks: number, totalBricks: number) => void;
  destroyedBricksRef: MutableRefObject<number>;
  totalBricksRef: MutableRefObject<number>;
  scoreRef: MutableRefObject<number>;
  setGameOver: (value: boolean) => void;
}

export function useBreakoutLogic({
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
}: BreakoutLogicProps) {
  const { height = 0 } = useWindowSize();
  const ballVelocityRef = useRef({
    dx: ballRef.current.dx,
    dy: ballRef.current.dy,
  });

  // Update velocity ref when ball speed changes
  ballVelocityRef.current = { dx: ballRef.current.dx, dy: ballRef.current.dy };

  function handleBrickCollisions() {
    bricks.forEach((brick) => {
      if (!brick.visible) return;

      // Check if any point of the ball's hitbox intersects with the brick
      const collision = ballRef.current.hitbox.points.some(
        (point) =>
          point.x >= brick.x &&
          point.x <= brick.x + brick.width &&
          point.y >= brick.y &&
          point.y <= brick.y + brick.height
      );

      if (collision) {
        // Determine which side was hit based on the ball's center position
        const relativeX = (ballRef.current.x - brick.x) / brick.width;
        const relativeY = (ballRef.current.y - brick.y) / brick.height;

        if (
          Math.min(relativeX, 1 - relativeX) <
          Math.min(relativeY, 1 - relativeY)
        ) {
          ballVelocityRef.current.dx = -ballVelocityRef.current.dx;
        } else {
          ballVelocityRef.current.dy = -ballVelocityRef.current.dy;
        }

        brick.visible = false;
        scoreRef.current += brick.points;
        destroyedBricksRef.current += 1;
        updateBallSpeed(destroyedBricksRef.current, totalBricksRef.current);
        return;
      }
    });
  }

  function handleWallCollisions(canvas: HTMLCanvasElement) {
    // Check left and right walls
    if (
      ballRef.current.hitbox.points.some((point) => point.x <= 0) ||
      ballRef.current.hitbox.points.some((point) => point.x >= canvas.width)
    ) {
      ballVelocityRef.current.dx = -ballVelocityRef.current.dx;
    }

    // Check ceiling
    if (ballRef.current.hitbox.points.some((point) => point.y <= 0)) {
      ballVelocityRef.current.dy = -ballVelocityRef.current.dy;
    }
    // Check paddle/floor TODO move paddle logic to own fn
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
        ballVelocityRef.current.dy = -ballVelocityRef.current.dy;
      } else {
        setGameOver(true);
        return;
      }
    }
  }

  function handlePaddleMovement(position: { x: number }) {
    movePaddleTo(position.x - paddleRef.current.width / 2);
  }

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    // Handle collisions using current position and hitbox
    handleBrickCollisions();
    handleWallCollisions(canvas);

    // Handle paddle movement using current ball position
    handlePaddleMovement({ x: ballRef.current.x });

    // Move ball with current velocity
    moveBall(ballVelocityRef.current.dx, ballVelocityRef.current.dy);

    // Draw the game state
    drawBreakoutGame({
      ctx,
      canvas,
      ball: {
        ...ballRef.current,
        dx: ballVelocityRef.current.dx,
        dy: ballVelocityRef.current.dy,
      },
      paddle: paddleRef.current,
      bricks,
      score: scoreRef.current,
      destroyedBricks: destroyedBricksRef.current,
      totalBricks: totalBricksRef.current,
    });
  };

  return { drawGame };
}
