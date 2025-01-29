export const BALL_RADIUS = 10;
export const PADDLE_WIDTH = 100;
export const PADDLE_HEIGHT = 20;

export const initialBallState = {
  x: 0,
  y: 0,
  radius: BALL_RADIUS,
  hitbox: {
    points: [
      { x: 0, y: 0 }, // Will be updated when game starts
    ],
  },
};

export const initialPaddleState = {
  x: 0,
  y: 0,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
};
