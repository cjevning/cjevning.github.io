import { useRef } from "react";
import { useWindowSize } from "usehooks-ts";

export interface Point {
  x: number;
  y: number;
}

export interface Hitbox {
  points: Point[];
  center: Point;
}

export interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  hitbox: Hitbox;
}

export function useBall() {
  const { width = 0, height = 0 } = useWindowSize();

  const BASE_SPEED = 7;
  const BALL_RADIUS = Math.min(width / 25, 10);

  const calculateHitbox = (position: Point): Hitbox => {
    const cornerOffset = BALL_RADIUS * 0.707; // cos(45°) for circular corners
    return {
      points: [
        // Corners (moved inward to match circular shape)
        { x: position.x - cornerOffset, y: position.y - cornerOffset }, // Top-left
        { x: position.x + cornerOffset, y: position.y - cornerOffset }, // Top-right
        { x: position.x - cornerOffset, y: position.y + cornerOffset }, // Bottom-left
        { x: position.x + cornerOffset, y: position.y + cornerOffset }, // Bottom-right
        // Cardinal points
        { x: position.x, y: position.y - BALL_RADIUS }, // Top-middle
        { x: position.x + BALL_RADIUS, y: position.y }, // Right-middle
        { x: position.x, y: position.y + BALL_RADIUS }, // Bottom-middle
        { x: position.x - BALL_RADIUS, y: position.y }, // Left-middle
      ],
      center: position,
    };
  };

  const initialPosition = { x: width / 2, y: height / 2 };
  const ballRef = useRef<Ball>({
    x: initialPosition.x,
    y: initialPosition.y,
    dx: BASE_SPEED,
    dy: -BASE_SPEED,
    radius: BALL_RADIUS,
    hitbox: calculateHitbox(initialPosition),
  });

  const updateBallSpeed = (destroyedBricks: number, totalBricks: number) => {
    const progress = destroyedBricks / totalBricks;
    const speedMultiplier = 1 + progress * 0.5;
    const currentPosition = { x: ballRef.current.x, y: ballRef.current.y };

    ballRef.current = {
      ...ballRef.current,
      dx: Math.sign(ballRef.current.dx) * BASE_SPEED * speedMultiplier,
      dy: Math.sign(ballRef.current.dy) * BASE_SPEED * speedMultiplier,
      hitbox: calculateHitbox(currentPosition),
    };
  };

  const reverseBallDirection = (reverseX: boolean, reverseY: boolean) => {
    const currentPosition = { x: ballRef.current.x, y: ballRef.current.y };

    ballRef.current = {
      ...ballRef.current,
      dx: reverseX ? -ballRef.current.dx : ballRef.current.dx,
      dy: reverseY ? -ballRef.current.dy : ballRef.current.dy,
      hitbox: calculateHitbox(currentPosition),
    };
  };

  const moveBall = (dx: number, dy: number) => {
    const newX = ballRef.current.x + dx;
    const newY = ballRef.current.y + dy;

    ballRef.current = {
      ...ballRef.current,
      x: newX,
      y: newY,
      hitbox: calculateHitbox({ x: newX, y: newY }),
    };
  };

  return {
    ball: ballRef.current,
    ballRef,
    updateBallSpeed,
    reverseBallDirection,
    moveBall,
  };
}
