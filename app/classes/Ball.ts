export interface Point {
  x: number;
  y: number;
}

export interface Hitbox {
  points: Point[];
  center: Point;
}

export class Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  hitbox: Hitbox;
  private baseSpeed: number;

  constructor(width: number, height: number) {
    this.baseSpeed = 7;
    this.radius = Math.min(width / 25, 10);

    // Start in center of screen
    this.x = width / 2;
    this.y = height / 2;
    this.dx = this.baseSpeed;
    this.dy = -this.baseSpeed;
    this.hitbox = this.calculateHitbox();
  }

  private calculateHitbox(): Hitbox {
    const cornerOffset = this.radius * 0.707; // cos(45°) for circular corners
    return {
      points: [
        // Corners (moved inward to match circular shape)
        { x: this.x - cornerOffset, y: this.y - cornerOffset }, // Top-left
        { x: this.x + cornerOffset, y: this.y - cornerOffset }, // Top-right
        { x: this.x - cornerOffset, y: this.y + cornerOffset }, // Bottom-left
        { x: this.x + cornerOffset, y: this.y + cornerOffset }, // Bottom-right
        // Cardinal points
        { x: this.x, y: this.y - this.radius }, // Top-middle
        { x: this.x + this.radius, y: this.y }, // Right-middle
        { x: this.x, y: this.y + this.radius }, // Bottom-middle
        { x: this.x - this.radius, y: this.y }, // Left-middle
      ],
      center: { x: this.x, y: this.y },
    };
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
    this.hitbox = this.calculateHitbox();
  }

  reverseDirection(reverseX: boolean, reverseY: boolean) {
    if (reverseX) this.dx = -this.dx;
    if (reverseY) this.dy = -this.dy;
    this.hitbox = this.calculateHitbox();
  }

  updateSpeed(destroyedBricks: number, totalBricks: number) {
    const progress = destroyedBricks / totalBricks;
    const speedMultiplier = 1 + progress * 0.5;

    this.dx = Math.sign(this.dx) * this.baseSpeed * speedMultiplier;
    this.dy = Math.sign(this.dy) * this.baseSpeed * speedMultiplier;
    this.hitbox = this.calculateHitbox();
  }
}
