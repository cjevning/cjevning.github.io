"use client";
import { useEffect, useRef, useState } from "react";
import useBricks from "./useBricks";
import { useIsClient, useWindowSize } from "usehooks-ts";
import useBall from "./useBall";

export default function Breakout({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { bricks } = useBricks();

  const { ball } = useBall();

  const isClient = useIsClient();

  const { width = 0, height = 0 } = useWindowSize();

  // const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isClient) {
      const canvas = canvasRef.current!;
      if (!canvas) return;

      const ctx = canvas.getContext("2d")!;
      if (!ctx) return;

      console.log("drawing");

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw bricks
      bricks.forEach((brick) => {
        if (!brick.broken) {
          ctx.fillStyle = brick.color;
          ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
          ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
        }
      });

      // Draw ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#0095dd";
      ctx.fill();
      ctx.closePath();
    }
  }, [bricks, isClient]);

  // const resizeCanvas = useDebounceCallback(() => {
  //   const canvas = canvasRef.current!;
  //   if (!canvas) return;

  //   const ctx = canvas.getContext("2d")!;
  //   if (!ctx) return;

  //   console.log("resizing");

  //   const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  //   canvas.width = width;
  //   canvas.height = height;

  //   ctx.putImageData(imageData, 0, 0);
  // });

  // useEffect(resizeCanvas, [width, height]);

  // useEffect(() => {
  //   function handleResize() {
  //     const canvas = canvasRef.current!;
  //     if (!canvas) return;

  //     const ctx = canvas.getContext("2d")!;
  //     if (!ctx) return;

  //     console.log("resizing");

  //     // Store the current content
  //     const tempCanvas = document.createElement("canvas");
  //     const tempCtx = tempCanvas.getContext("2d")!;
  //     tempCanvas.width = canvas.width;
  //     tempCanvas.height = canvas.height;
  //     tempCtx.drawImage(canvas, 0, 0);

  //     // Update canvas dimensions
  //     canvas.width = window.innerWidth;
  //     canvas.height = window.innerHeight;

  //     // Draw the old content back, scaled to the new size
  //     ctx.drawImage(
  //       tempCanvas,
  //       0,
  //       0,
  //       tempCanvas.width,
  //       tempCanvas.height,
  //       0,
  //       0,
  //       canvas.width,
  //       canvas.height
  //     );
  //   }

  //   window.addEventListener("resize", handleResize);
  //   handleResize();

  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  // TODO: handle this better
  if (!width || !height || !isClient) return null;

  return (
    <div className="w-screen h-screen relative">
      <canvas ref={canvasRef} width={width} height={height} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {children}
      </div>
    </div>
  );
}
