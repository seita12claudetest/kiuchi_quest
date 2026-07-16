export interface Point { x: number; y: number }

export class Camera {
  x = 0
  y = 0

  constructor(
    public readonly viewportWidth: number,
    public readonly viewportHeight: number,
    public readonly tileSize = 40,
    private smoothing = 1,
  ) {}

  follow(targetX: number, targetY: number, mapWidth: number, mapHeight: number, dt = 1): void {
    const desiredX = targetX * this.tileSize + this.tileSize / 2 - this.viewportWidth / 2
    const desiredY = targetY * this.tileSize + this.tileSize / 2 - this.viewportHeight / 2
    const alpha = this.smoothing >= 1 ? 1 : Math.min(1, Math.max(0, this.smoothing * dt))
    this.x += (desiredX - this.x) * alpha
    this.y += (desiredY - this.y) * alpha
    this.clamp(mapWidth, mapHeight)
  }

  clamp(mapWidth: number, mapHeight: number): void {
    const maxX = Math.max(0, mapWidth * this.tileSize - this.viewportWidth)
    const maxY = Math.max(0, mapHeight * this.tileSize - this.viewportHeight)
    this.x = Math.min(Math.max(0, this.x), maxX)
    this.y = Math.min(Math.max(0, this.y), maxY)
  }

  worldToScreen(worldX: number, worldY: number): Point {
    return { x: worldX * this.tileSize - this.x, y: worldY * this.tileSize - this.y }
  }

  screenToWorld(screenX: number, screenY: number): Point {
    return { x: (screenX + this.x) / this.tileSize, y: (screenY + this.y) / this.tileSize }
  }
}
