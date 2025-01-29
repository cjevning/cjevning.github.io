import { useCallback, useEffect, useRef } from "react";
import { useIsClient, useWindowSize } from "usehooks-ts";
import { usePong } from "./hooks/usePong";
import { useGameLoop } from "./hooks/useGameLoop";

interface Props {
  children?: React.ReactNode;
}

function drawPongGame(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  {
    ball,
    paddle1,
    paddle2,
    score,
    isPortrait,
  }: {
    ball: { x: number; y: number; radius: number };
    paddle1: { x: number; y: number; width: number; height: number };
    paddle2: { x: number; y: number; width: number; height: number };
    score: { player1: number; player2: number };
    isPortrait: boolean;
  }
) {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw center line
  ctx.setLineDash([5, 15]);
  ctx.beginPath();
  if (isPortrait) {
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
  } else {
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
  }
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw score
  ctx.font = "48px Arial";
  ctx.fillStyle = "#ffffff";
  if (isPortrait) {
    ctx.fillText(score.player2.toString(), 50, canvas.height / 4);
    ctx.fillText(score.player1.toString(), 50, (canvas.height * 3) / 4);
  } else {
    ctx.fillText(score.player1.toString(), canvas.width / 4, 50);
    ctx.fillText(score.player2.toString(), (canvas.width * 3) / 4, 50);
  }

  // Draw paddles
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
  ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);

  // Draw ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.closePath();
}

export default function Pong({ children }: Props) {
  const { width = 0, height = 0 } = useWindowSize();
  const isClient = useIsClient();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    gameOver,
    scoreRef,
    ballRef,
    paddle1Ref,
    paddle2Ref,
    movePaddle1To,
    movePaddle2To,
    updateGame,
    isPortrait,
  } = usePong();

  const drawGameFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    updateGame();

    drawPongGame(ctx, canvas, {
      ball: ballRef.current,
      paddle1: paddle1Ref.current,
      paddle2: paddle2Ref.current,
      score: scoreRef.current,
      isPortrait,
    });
  }, [updateGame, ballRef, paddle1Ref, paddle2Ref, scoreRef, isPortrait]);

  useGameLoop({
    isRunning: !gameOver,
    drawGame: drawGameFrame,
  });

  // Handle keyboard controls
  useEffect(() => {
    if (!isClient) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPortrait) {
        switch (e.key) {
          case "ArrowLeft":
          case "a":
            movePaddle1To(paddle1Ref.current.x - 20);
            break;
          case "ArrowRight":
          case "d":
            movePaddle1To(paddle1Ref.current.x + 20);
            break;
        }
      } else {
        switch (e.key) {
          case "w":
            movePaddle1To(paddle1Ref.current.y - 20);
            break;
          case "s":
            movePaddle1To(paddle1Ref.current.y + 20);
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isClient, movePaddle1To, isPortrait]);

  if (!isClient) return null;

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="absolute top-0 left-0 w-full h-full"
      />
      {children}
    </div>
  );
}
