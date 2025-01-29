import { useRef, useState } from "react";
import { useWindowSize } from "usehooks-ts";
import { useBall } from "./useBall";
import { usePaddle } from "./usePaddle";
import { Ball } from "../classes/Ball";

export function usePong() {
  const [gameOver, setGameOver] = useState(false);
  const scoreRef = useRef({ player1: 0, player2: 0 });
  const { width = 0, height = 0 } = useWindowSize();
  const orientation = height > width ? "portrait" : "landscape";

  const { ballRef, moveBall } = useBall();
  const { paddleRef: paddle1Ref, movePaddleTo: movePaddle1To } = usePaddle({
    orientation,
    width,
    height,
  });
  const { paddleRef: paddle2Ref, movePaddleTo: movePaddle2To } = usePaddle({
    orientation,
    width,
    height,
  });

  // Initialize paddle positions based on orientation
  if (orientation === "portrait") {
    // Vertical layout (mobile)
    paddle1Ref.current.x = width / 2 - paddle1Ref.current.width / 2;
    paddle1Ref.current.y = height - 100; // Bottom paddle
    paddle2Ref.current.x = width / 2 - paddle2Ref.current.width / 2;
    paddle2Ref.current.y = 100; // Top paddle
  } else {
    // Horizontal layout (desktop)
    paddle1Ref.current.x = 50; // Left side
    paddle1Ref.current.y = height / 2 - paddle1Ref.current.height / 2;
    paddle2Ref.current.x = width - 150; // Right side
    paddle2Ref.current.y = height / 2 - paddle2Ref.current.height / 2;
  }

  function handlePaddleCollisions() {
    const ballY = ballRef.current.y;
    const ballX = ballRef.current.x;

    if (orientation === "portrait") {
      // Vertical layout collisions
      if (
        ballY + ballRef.current.radius >= paddle1Ref.current.y &&
        ballY - ballRef.current.radius <=
          paddle1Ref.current.y + paddle1Ref.current.height &&
        ballX >= paddle1Ref.current.x &&
        ballX <= paddle1Ref.current.x + paddle1Ref.current.width
      ) {
        ballRef.current.reverseDirection(false, true);
        ballRef.current.dy = -Math.abs(ballRef.current.dy); // Force upward movement
      }

      if (
        ballY - ballRef.current.radius <=
          paddle2Ref.current.y + paddle2Ref.current.height &&
        ballY + ballRef.current.radius >= paddle2Ref.current.y &&
        ballX >= paddle2Ref.current.x &&
        ballX <= paddle2Ref.current.x + paddle2Ref.current.width
      ) {
        ballRef.current.reverseDirection(false, true);
        ballRef.current.dy = Math.abs(ballRef.current.dy); // Force downward movement
      }
    } else {
      // Horizontal layout collisions
      if (
        ballX - ballRef.current.radius <=
          paddle1Ref.current.x + paddle1Ref.current.width &&
        ballX + ballRef.current.radius >= paddle1Ref.current.x &&
        ballY >= paddle1Ref.current.y &&
        ballY <= paddle1Ref.current.y + paddle1Ref.current.height
      ) {
        ballRef.current.reverseDirection(true, false);
        ballRef.current.dx = Math.abs(ballRef.current.dx); // Force rightward movement
      }

      if (
        ballX + ballRef.current.radius >= paddle2Ref.current.x &&
        ballX - ballRef.current.radius <=
          paddle2Ref.current.x + paddle2Ref.current.width &&
        ballY >= paddle2Ref.current.y &&
        ballY <= paddle2Ref.current.y + paddle2Ref.current.height
      ) {
        ballRef.current.reverseDirection(true, false);
        ballRef.current.dx = -Math.abs(ballRef.current.dx); // Force leftward movement
      }
    }
  }

  function handleWallCollisions() {
    if (orientation === "portrait") {
      // Vertical layout walls
      if (
        ballRef.current.hitbox.points.some((point) => point.x <= 0) ||
        ballRef.current.hitbox.points.some((point) => point.x >= width)
      ) {
        ballRef.current.reverseDirection(true, false);
      }

      // Scoring on top/bottom
      if (ballRef.current.y <= 0) {
        scoreRef.current.player1 += 1;
        resetBall();
      } else if (ballRef.current.y >= height) {
        scoreRef.current.player2 += 1;
        resetBall();
      }
    } else {
      // Horizontal layout walls
      if (
        ballRef.current.hitbox.points.some((point) => point.y <= 0) ||
        ballRef.current.hitbox.points.some((point) => point.y >= height)
      ) {
        ballRef.current.reverseDirection(false, true);
      }

      // Scoring on left/right
      if (ballRef.current.x <= 0) {
        scoreRef.current.player2 += 1;
        resetBall();
      } else if (ballRef.current.x >= width) {
        scoreRef.current.player1 += 1;
        resetBall();
      }
    }
  }

  function resetBall() {
    const newBall = new Ball(width, height);
    if (orientation === "portrait") {
      newBall.dy = Math.random() > 0.5 ? 7 : -7;
      newBall.dx = Math.random() * 14 - 7;
    } else {
      newBall.dx = Math.random() > 0.5 ? 7 : -7;
      newBall.dy = Math.random() * 14 - 7;
    }
    ballRef.current = newBall;
  }

  function updateGame() {
    if (gameOver) return;

    handlePaddleCollisions();
    handleWallCollisions();

    // AI for player 2 (top paddle in portrait, right paddle in landscape)
    const targetPosition =
      orientation === "portrait"
        ? ballRef.current.x - paddle2Ref.current.width / 2
        : ballRef.current.y - paddle2Ref.current.height / 2;

    if (orientation === "portrait") {
      movePaddle2To(targetPosition);
    } else {
      movePaddle2To(targetPosition);
    }

    // Move ball
    ballRef.current.move();
  }

  return {
    gameOver,
    scoreRef,
    ballRef,
    paddle1Ref,
    paddle2Ref,
    movePaddle1To,
    movePaddle2To,
    updateGame,
    orientation,
  };
}
