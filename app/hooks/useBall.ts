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
  calculateHitbox: (position: Point) => Hitbox;
}

export function useBall() {
  const { width = 0, height = 0 } = useWindowSize();
  const BALL_RADIUS = Math.min(width / 25, 10);

  const calculateHitbox = (position: Point): Hitbox => {
    const cornerOffset = BALL_RADIUS * 0.707;
    return {
      points: [
        { x: position.x - cornerOffset, y: position.y - cornerOffset },
        { x: position.x + cornerOffset, y: position.y - cornerOffset },
        { x: position.x - cornerOffset, y: position.y + cornerOffset },
        { x: position.x + cornerOffset, y: position.y + cornerOffset },
        { x: position.x, y: position.y - BALL_RADIUS },
        { x: position.x + BALL_RADIUS, y: position.y },
        { x: position.x, y: position.y + BALL_RADIUS },
        { x: position.x - BALL_RADIUS, y: position.y },
      ],
      center: position,
    };
  };

  const initialPosition = { x: width / 2, y: height / 2 };
  const ballRef = useRef<Ball>({
    x: initialPosition.x,
    y: initialPosition.y,
    dx: 7,
    dy: -7,
    radius: BALL_RADIUS,
    hitbox: calculateHitbox(initialPosition),
    calculateHitbox,
  });

  return ballRef;
}
