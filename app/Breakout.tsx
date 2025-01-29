"use client";
import { useEffect, useRef, useState } from "react";
import { useWindowSize, useIsClient } from "usehooks-ts";
import { useBricks } from "./hooks/useBricks";
import { useBall } from "./hooks/useBall";
import { usePaddle } from "./hooks/usePaddle";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default function Breakout({ children }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const scoreRef = useRef(0);
  const [countdown, setCountdown] = useState(0);
  const { width = 800, height = 600 } = useWindowSize();
  const isClient = useIsClient();
  const router = useRouter();

  const { totalBricksRef, destroyedBricksRef, createBricks } = useBricks(
    width,
    height
  );
  const { createBall, updateBallSpeed } = useBall(width, height);
  const { createPaddle } = usePaddle(width, height);

  useEffect(() => {
    if (!isClient) return;

    const canvas = canvasRef.current!;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    const isMobileFormFactor = height > width;

    // Initialize game objects
    const paddle = createPaddle(canvas.width);
    const { ball, BASE_SPEED } = createBall(canvas.width, paddle.height);
    const bricks = createBricks(isMobileFormFactor);

    // Add click handler for navigation
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Check if any navigation brick was clicked
      bricks.forEach((brick) => {
        if (
          brick.isNavBrick &&
          brick.visible &&
          clickX >= brick.x &&
          clickX <= brick.x + brick.width &&
          clickY >= brick.y &&
          clickY <= brick.y + brick.height
        ) {
          router.push(brick.link!);
        }
      });
    };

    canvas.addEventListener("click", handleCanvasClick);

    function draw() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw bricks
      bricks.forEach((brick) => {
        if (brick.visible) {
          ctx.fillStyle = brick.color;
          ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
          ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
        } else {
          // Draw dotted outline for destroyed bricks
          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = brick.color;
          ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
          ctx.setLineDash([]);
          ctx.strokeStyle = "#000";
        }

        // Add text for navigation bricks (whether visible or not)
        if (brick.isNavBrick) {
          ctx.font = `${brick.height * 0.4}px Arial`;
          ctx.fillStyle = brick.visible ? "#ffffff" : brick.color;
          const text = brick.link!.replace("/", "");
          const textMetrics = ctx.measureText(text);
          ctx.fillText(
            text,
            brick.x + (brick.width - textMetrics.width) / 2,
            brick.y + brick.height * 0.65
          );
        }
      });

      // Check for win condition
      if (destroyedBricksRef.current === totalBricksRef.current) {
        ctx.font = `${width * 0.04}px Arial`;
        ctx.fillStyle = "#2ed573";
        const winText = "Winner!";
        const textMetrics = ctx.measureText(winText);
        ctx.fillText(
          winText,
          canvas.width / 2 - textMetrics.width / 2,
          canvas.height - paddle.height - 60
        );
        return; // Stop the game loop when won
      }

      // Draw score and controls
      ctx.font = `${width * 0.02}px Arial`;
      ctx.fillStyle = "#2ed573";
      const scoreText = `Score: ${scoreRef.current}`;
      const scoreMetrics = ctx.measureText(scoreText);
      ctx.fillText(
        scoreText,
        canvas.width / 2 - scoreMetrics.width / 2,
        canvas.height - 10
      );

      // Draw paddle
      ctx.fillStyle = "#0095dd";
      ctx.fillRect(
        paddle.x,
        canvas.height - paddle.height - 30,
        paddle.width,
        paddle.height
      );

      // Draw ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#0095dd";
      ctx.fill();
      ctx.closePath();

      // Update collision detection with bricks
      bricks.forEach((brick) => {
        if (
          brick.visible &&
          ball.x > brick.x &&
          ball.x < brick.x + brick.width &&
          ball.y > brick.y &&
          ball.y < brick.y + brick.height
        ) {
          ball.dy = -ball.dy;
          brick.visible = false;
          scoreRef.current += brick.points;
          destroyedBricksRef.current += 1; // Increment destroyed bricks counter
          updateBallSpeed(
            ball,
            BASE_SPEED,
            destroyedBricksRef.current,
            totalBricksRef.current
          ); // Check if speed should increase
        }
      });

      // Collision detection with walls
      if (
        ball.x + ball.dx > canvas.width - ball.radius ||
        ball.x + ball.dx < ball.radius
      ) {
        ball.dx = -ball.dx;
      }
      if (ball.y + ball.dy < ball.radius) {
        ball.dy = -ball.dy;
      } else if (
        ball.y + ball.dy >
        canvas.height - paddle.height - 30 - ball.radius
      ) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
          ball.dy = -ball.dy;
        } else {
          setGameOver(true);
          return;
        }
      }

      // AI control
      paddle.x = ball.x - paddle.width / 2;
      if (paddle.x < 0) paddle.x = 0;
      if (paddle.x + paddle.width > canvas.width) {
        paddle.x = canvas.width - paddle.width;
      }

      // Move ball
      ball.x += ball.dx;
      ball.y += ball.dy;

      if (!gameOver) {
        requestAnimationFrame(draw);
      }
    }

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
      return () => {
        clearTimeout(timer);
        canvas.removeEventListener("click", handleCanvasClick);
      };
    } else {
      draw();
      return () => {
        canvas.removeEventListener("click", handleCanvasClick);
      };
    }
  }, [gameOver, width, height, countdown, isClient, router]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="w-screen h-screen relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full"
      />
      {/* TODO: remove the h-7 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-7">
        {children}
      </div>
    </div>
  );
}
