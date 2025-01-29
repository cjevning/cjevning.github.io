import { useRef } from "react";

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
}

export function useBall(width: number, height: number) {
  const speedLevelRef = useRef(0);

  const createBall = (canvasWidth: number, paddleHeight: number) => {
    const BASE_SPEED = width * 0.004;
    const BALL_RADIUS = (height > width ? height : width) * 0.01;

    const ball: Ball = {
      x: canvasWidth / 2,
      y: height - paddleHeight - 50,
      dx: BASE_SPEED,
      dy: -BASE_SPEED,
      radius: BALL_RADIUS,
    };

    return { ball, BASE_SPEED };
  };

  const updateBallSpeed = (
    ball: Ball,
    BASE_SPEED: number,
    destroyedBricks: number,
    totalBricks: number
  ) => {
    const destroyedPercentage = (destroyedBricks / totalBricks) * 100;
    const newSpeedLevel = Math.floor(destroyedPercentage / 25);

    if (newSpeedLevel > speedLevelRef.current && speedLevelRef.current < 3) {
      speedLevelRef.current = newSpeedLevel;
      const speedMultiplier = 1 + speedLevelRef.current * 0.4;
      ball.dx = (ball.dx > 0 ? BASE_SPEED : -BASE_SPEED) * speedMultiplier;
      ball.dy = (ball.dy > 0 ? BASE_SPEED : -BASE_SPEED) * speedMultiplier;
    }
  };

  return {
    createBall,
    updateBallSpeed,
    speedLevelRef,
  };
}
