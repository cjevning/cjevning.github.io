import { useRef, useEffect } from "react";
import { useWindowSize } from "usehooks-ts";

const BRICK_ROWS = 5;
export const MAX_BRICK_POINTS = 5;
const colors = ["#0066cc", "#ff4757", "#2ed573", "#ffa502", "#5352ed"];

export interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  color: string;
  points: number;
  isNavBrick?: boolean;
  link?: string;
}

export function useBricks(minCols = 3) {
  const { width = 0 } = useWindowSize();
  const bricksRef = useRef<Brick[]>([]);

  useEffect(() => {
    const BRICK_COLS =
      width < 500 ? minCols : width < 1000 ? minCols + 2 : minCols + 6;
    const BRICK_WIDTH = (width * 0.95) / BRICK_COLS;
    const BRICK_HEIGHT = BRICK_WIDTH * 0.25;
    const BRICK_PADDING = (width * 0.05) / (BRICK_COLS + 1);
    const BRICK_OFFSET_TOP = BRICK_PADDING;

    const bricks: Brick[] = [];
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        bricks.push({
          x: col * (BRICK_WIDTH + BRICK_PADDING) + BRICK_PADDING,
          y: row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
          width: BRICK_WIDTH,
          height: BRICK_HEIGHT,
          visible: true,
          color: colors[row % colors.length],
          points: MAX_BRICK_POINTS - row * (MAX_BRICK_POINTS / BRICK_ROWS),
        });
      }
    }

    bricksRef.current = bricks;
  }, [width, minCols]);

  return bricksRef;
}
