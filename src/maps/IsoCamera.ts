export interface Point { x: number; y: number }

/**
 * 2:1 isometric projection camera. World coordinates stay identical to the
 * orthogonal grid (tile indices) so collision/movement systems are untouched;
 * only the screen-space transform differs from `Camera`.
 */
export class IsoCamera {
  x = 0
  y = 0

  constructor(
    public readonly viewportWidth: number,
    public readonly viewportHeight: number,
    public readonly tileWidth = 64,
    public readonly tileHeight = 32,
    private smoothing = 1,
  ) {}

  /** Projects a tile coordinate to unscrolled world-pixel space (top vertex of the tile diamond). */
  project(worldX: number, worldY: number): Point {
    return {
      x: (worldX - worldY) * (this.tileWidth / 2),
      y: (worldX + worldY) * (this.tileHeight / 2),
    }
  }

  /** Total map bounds in projected pixel space, used for camera clamping. */
  bounds(mapWidth: number, mapHeight: number): { minX: number; maxX: number; minY: number; maxY: number } {
    const corners = [
      this.project(0, 0),
      this.project(mapWidth - 1, 0),
      this.project(0, mapHeight - 1),
      this.project(mapWidth - 1, mapHeight - 1),
    ]
    return {
      minX: Math.min(...corners.map(c => c.x)) - this.tileWidth / 2,
      maxX: Math.max(...corners.map(c => c.x)) + this.tileWidth / 2,
      minY: Math.min(...corners.map(c => c.y)) - this.tileHeight,
      maxY: Math.max(...corners.map(c => c.y)) + this.tileHeight * 2,
    }
  }

  follow(targetX: number, targetY: number, mapWidth: number, mapHeight: number, dt = 1): void {
    const target = this.project(targetX, targetY)
    const desiredX = target.x - this.viewportWidth / 2
    const desiredY = target.y - this.viewportHeight / 2
    const alpha = this.smoothing >= 1 ? 1 : Math.min(1, Math.max(0, this.smoothing * dt))
    this.x += (desiredX - this.x) * alpha
    this.y += (desiredY - this.y) * alpha
    this.clamp(mapWidth, mapHeight)
  }

  clamp(mapWidth: number, mapHeight: number): void {
    const { minX, maxX, minY, maxY } = this.bounds(mapWidth, mapHeight)
    const maxScrollX = Math.max(minX, maxX - this.viewportWidth)
    const maxScrollY = Math.max(minY, maxY - this.viewportHeight)
    this.x = Math.min(Math.max(minX, this.x), maxScrollX)
    this.y = Math.min(Math.max(minY, this.y), maxScrollY)
  }

  worldToScreen(worldX: number, worldY: number): Point {
    const projected = this.project(worldX, worldY)
    return { x: projected.x - this.x, y: projected.y - this.y }
  }
}
