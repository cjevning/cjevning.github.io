interface Paddle {
  x: number;
  width: number;
  height: number;
}

export function usePaddle(width: number, height: number) {
  const createPaddle = (canvasWidth: number) => {
    const PADDLE_WIDTH = width * 0.15;
    const PADDLE_HEIGHT = height * 0.015;

    const paddle: Paddle = {
      x: canvasWidth / 2 - PADDLE_WIDTH / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
    };

    return paddle;
  };

  return {
    createPaddle,
  };
}
