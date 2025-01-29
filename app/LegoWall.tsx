"use client";
// components/LegoWall.tsx
import React, { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  falling: boolean;
  yOffset: number;
}

interface LegoWallProps {
  children: React.ReactNode;
}

const colors = ["red", "blue", "green", "yellow"]; // Add more colors as needed

const LegoWall: React.FC<LegoWallProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [shouldFall, setShouldFall] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const nextPathRef = useRef<string | null>(null);

  // Start animation before navigation
  const handleNavigation = (href: string) => {
    nextPathRef.current = href;
    setCurrentColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    setShouldFall(true);
    setIsTransitioning(true);
  };

  // Listen for navigation events
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");
      if (link && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        handleNavigation(link.href);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const drawBrick = (
      x: number,
      y: number,
      width: number,
      height: number,
      color: string
    ) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
      ctx.strokeRect(x, y, width, height);
    };

    const bricks: Brick[] = [];
    const brickWidth = 20;
    const brickHeight = 10;
    const cols = Math.floor(canvas.width / brickWidth);
    const rows = Math.floor(canvas.height / brickHeight);

    // Initialize bricks
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * brickWidth;
        const y = row * brickHeight;
        bricks.push({
          x,
          y,
          width: brickWidth,
          height: brickHeight,
          color: colors[currentColorIndex],
          falling: shouldFall,
          yOffset: 0,
        });
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let stillFalling = false;

      bricks.forEach((brick) => {
        if (brick.falling) {
          brick.yOffset += 2;
          if (brick.y + brick.yOffset > canvas.height) {
            brick.yOffset = 0;
            brick.y = -brickHeight;
            brick.color = colors[currentColorIndex];
            brick.falling = false;
          }
          stillFalling = true;
        }

        drawBrick(
          brick.x,
          brick.y + brick.yOffset,
          brick.width,
          brick.height,
          brick.color
        );
      });

      if (stillFalling) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setShouldFall(false);
        // Navigate after animation completes
        if (isTransitioning && nextPathRef.current) {
          window.location.href = nextPathRef.current;
          setIsTransitioning(false);
          nextPathRef.current = null;
        }
      }
    };

    if (shouldFall) {
      animate();
    } else {
      // Draw static bricks when not falling
      bricks.forEach((brick) => {
        drawBrick(
          brick.x,
          brick.y + brick.yOffset,
          brick.width,
          brick.height,
          brick.color
        );
      });
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [currentColorIndex, shouldFall, isTransitioning]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="w-screen h-screen fixed top-0 left-0 z-[-1]"
      />
      {children}
    </>
  );
};

export default LegoWall;
