import { Ball } from "../hooks/useBall";
import { Brick } from "../hooks/useBricks";
import { Paddle } from "../hooks/usePaddle";

interface DrawContext {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  ball: Ball;
  paddle: Paddle;
  bricks: Brick[];
  score: number;
  destroyedBricks: number;
  totalBricks: number;
}

export function drawGame({
  ctx,
  canvas,
  ball,
  paddle,
  bricks,
  score,
  destroyedBricks,
  totalBricks,
}: DrawContext) {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw bricks
  drawBricks(ctx, bricks);

  // Check for win condition
  if (destroyedBricks === totalBricks) {
    drawWinMessage(ctx, canvas, paddle);
    return;
  }

  // Draw score
  drawScore(ctx, canvas, score);

  // Draw paddle
  drawPaddle(ctx, paddle, canvas.height);

  // Draw ball
  drawBall(ctx, ball);
}

function drawBricks(ctx: CanvasRenderingContext2D, bricks: Brick[]) {
  bricks.forEach((brick) => {
    if (brick.visible) {
      ctx.fillStyle = brick.color;
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
    } else {
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = brick.color;
      ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
      ctx.setLineDash([]);
      ctx.strokeStyle = "#000";
    }

    // if (brick.isNavBrick) {
    //   drawNavBrickText(ctx, brick);
    // }
  });
}

// function drawNavBrickText(ctx: CanvasRenderingContext2D, brick: Brick) {
//   ctx.font = `${brick.height * 0.4}px Arial`;
//   ctx.fillStyle = brick.visible ? "#ffffff" : brick.color;
//   const text = brick.link!.replace("/", "");
//   const textMetrics = ctx.measureText(text);
//   ctx.fillText(
//     text,
//     brick.x + (brick.width - textMetrics.width) / 2,
//     brick.y + brick.height * 0.65
//   );
// }

function drawWinMessage(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  paddle: Paddle
) {
  ctx.font = `${canvas.width * 0.04}px Arial`;
  ctx.fillStyle = "#2ed573";
  const winText = "Winner!";
  const textMetrics = ctx.measureText(winText);
  ctx.fillText(
    winText,
    canvas.width / 2 - textMetrics.width / 2,
    canvas.height - paddle.height - 60
  );
}

function drawScore(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  score: number
) {
  ctx.font = `${canvas.width * 0.02}px Arial`;
  ctx.fillStyle = "#2ed573";
  const scoreText = `Score: ${score}`;
  const scoreMetrics = ctx.measureText(scoreText);
  ctx.fillText(
    scoreText,
    canvas.width - scoreMetrics.width - 10,
    canvas.height - 10
  );
}

function drawPaddle(
  ctx: CanvasRenderingContext2D,
  paddle: Paddle,
  canvasHeight: number
) {
  ctx.fillStyle = "#0095dd";
  ctx.fillRect(
    paddle.x,
    canvasHeight - paddle.height - 30,
    paddle.width,
    paddle.height
  );
}

function drawBall(ctx: CanvasRenderingContext2D, ball: Ball) {
  ctx.beginPath();
  ctx.arc(ball.x + ball.dx, ball.y + ball.dy, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}
