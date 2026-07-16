import type { GameState, MapDef, TimeSlot } from '@/types'
import { Camera } from './Camera'

const TILE_SIZE = 40
const TILE_COLORS: Record<number, string> = {
  0: '#3f7f3f', 1: '#555555', 2: '#7a5332', 3: '#2d5f9a', 4: '#b88b45', 5: '#303038', 6: '#f1f1e6', 7: '#8e4bd1', 8: '#4f7d5a', 9: '#9a9a9a',
}
const OVERLAYS: Partial<Record<TimeSlot, string>> = { morning: 'rgba(255,180,80,0.08)', evening: 'rgba(255,100,40,0.16)', night: 'rgba(0,0,40,0.38)' }

export class MapRenderer {
  readonly camera: Camera

  constructor(viewportWidth: number, viewportHeight: number, tileSize = TILE_SIZE) {
    this.camera = new Camera(viewportWidth, viewportHeight, tileSize, 0.25)
  }

  render(ctx: CanvasRenderingContext2D, map: MapDef, state: GameState): void {
    this.camera.follow(state.player.x, state.player.y, map.width, map.height)
    ctx.clearRect(0, 0, this.camera.viewportWidth, this.camera.viewportHeight)
    this.renderTiles(ctx, map)
    this.renderNpcs(ctx, map)
    this.renderPlayer(ctx, state.player.x, state.player.y)
    this.renderTimeOverlay(ctx, state.timeSlot)
  }

  private renderTiles(ctx: CanvasRenderingContext2D, map: MapDef): void {
    const startX = Math.max(0, Math.floor(this.camera.x / this.camera.tileSize))
    const startY = Math.max(0, Math.floor(this.camera.y / this.camera.tileSize))
    const endX = Math.min(map.width, Math.ceil((this.camera.x + this.camera.viewportWidth) / this.camera.tileSize) + 1)
    const endY = Math.min(map.height, Math.ceil((this.camera.y + this.camera.viewportHeight) / this.camera.tileSize) + 1)

    for (let y = startY; y < endY; y += 1) {
      for (let x = startX; x < endX; x += 1) {
        const screen = this.camera.worldToScreen(x, y)
        ctx.fillStyle = TILE_COLORS[map.tiles[y][x]] ?? '#222222'
        ctx.fillRect(screen.x, screen.y, this.camera.tileSize, this.camera.tileSize)
        if (map.collisions[y][x]) {
          ctx.fillStyle = 'rgba(0,0,0,0.25)'
          ctx.fillRect(screen.x + 4, screen.y + 4, this.camera.tileSize - 8, this.camera.tileSize - 8)
        }
      }
    }
  }

  private renderNpcs(ctx: CanvasRenderingContext2D, map: MapDef): void {
    ctx.fillStyle = '#ffdd55'
    for (const npc of map.npcs) {
      const screen = this.camera.worldToScreen(npc.x, npc.y)
      ctx.fillRect(screen.x + 8, screen.y + 8, this.camera.tileSize - 16, this.camera.tileSize - 16)
    }
  }

  private renderPlayer(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const screen = this.camera.worldToScreen(x, y)
    ctx.fillStyle = '#4cc9f0'
    ctx.fillRect(screen.x + 6, screen.y + 6, this.camera.tileSize - 12, this.camera.tileSize - 12)
  }

  private renderTimeOverlay(ctx: CanvasRenderingContext2D, timeSlot: TimeSlot): void {
    const overlay = OVERLAYS[timeSlot]
    if (!overlay) return
    ctx.fillStyle = overlay
    ctx.fillRect(0, 0, this.camera.viewportWidth, this.camera.viewportHeight)
  }
}
