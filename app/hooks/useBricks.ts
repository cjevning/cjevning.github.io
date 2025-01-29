import { useRef } from "react";

interface Brick {
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

export function useBricks(width: number, height: number) {
  const totalBricksRef = useRef(5 * 9);
  const destroyedBricksRef = useRef(0);

  const createBricks = (isMobileFormFactor: boolean) => {
    const BRICK_ROWS = 5;
    const BRICK_COLS = isMobileFormFactor ? 4 : 9;
    const BRICK_WIDTH = (width * 0.95) / BRICK_COLS;
    const BRICK_HEIGHT = BRICK_WIDTH * 0.25;
    const BRICK_PADDING = (width * 0.05) / (BRICK_COLS - 1);
    const BRICK_OFFSET_TOP = BRICK_PADDING;
    const colors = ["#0095dd", "#ff4757", "#2ed573", "#ffa502", "#5352ed"];

    const bricks: Brick[] = [];
    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        bricks.push({
          x: col * (BRICK_WIDTH + BRICK_PADDING),
          y: row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
          width: BRICK_WIDTH,
          height: BRICK_HEIGHT,
          visible: true,
          color: colors[row % colors.length],
          points: BRICK_ROWS - row,
        });
      }
    }

    // Add navigation bricks in the top middle
    const navLinks = ["/about", "/experience", "/connect"];
    const navBrickStartCol = Math.floor((BRICK_COLS - navLinks.length) / 2);

    navLinks.forEach((link, index) => {
      const brick = bricks[navBrickStartCol + index];
      if (brick) {
        brick.isNavBrick = true;
        brick.link = link;
        brick.color = "#4834d4"; // Different color for nav bricks
        brick.points = 0; // Optional: make nav bricks worth no points
      }
    });

    return bricks;
  };

  return {
    totalBricksRef,
    destroyedBricksRef,
    createBricks,
  };
}
