import type { GameState, MapDef, TimeSlot } from '@/types'
import { Camera } from './Camera'

const TILE_SIZE = 40
const TILE_COLORS: Record<number, string> = {
  0: '#3f7f3f', 1: '#555555', 2: '#7a5332', 3: '#2d5f9a', 4: '#b88b45', 5: '#303038', 6: '#f1f1e6', 7: '#8e4bd1', 8: '#4f7d5a', 9: '#9a9a9a',
}
const OVERLAYS: Partial<Record<TimeSlot, string>> = { morning: 'rgba(255,180,80,0.08)', evening: 'rgba(255,100,40,0.16)', night: 'rgba(0,0,40,0.38)' }

export class MapRenderer {
  readonly camera: Camera
  private readonly yokochoBackground = this.loadImage('assets/maps/yokocho-night.png')
  private readonly officeBackground = this.loadImage('assets/maps/office-1988.png')
  private readonly kiuchiSprite = this.loadImage('assets/characters/kiuchi-walk.png')

  constructor(viewportWidth: number, viewportHeight: number, tileSize = TILE_SIZE) {
    this.camera = new Camera(viewportWidth, viewportHeight, tileSize, 0.25)
  }

  render(ctx: CanvasRenderingContext2D, map: MapDef, state: GameState): void {
    this.camera.follow(state.player.x, state.player.y, map.width, map.height)
    ctx.clearRect(0, 0, this.camera.viewportWidth, this.camera.viewportHeight)
    const background = map.id === 'yokocho' ? this.yokochoBackground : map.id === 'office' ? this.officeBackground : undefined
    if (background?.complete && background.naturalWidth > 0) {
      ctx.drawImage(background, 0, 0, this.camera.viewportWidth, this.camera.viewportHeight)
    } else {
      this.renderTiles(ctx, map)
    }
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
    for (const npc of map.npcs) {
      const screen = this.camera.worldToScreen(npc.x, npc.y)
      ctx.fillStyle = '#3a2419'
      ctx.beginPath()
      ctx.arc(screen.x + 20, screen.y + 18, 11, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#d4a15d'
      ctx.fillRect(screen.x + 12, screen.y + 28, 16, 10)
    }
  }

  private renderPlayer(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const screen = this.camera.worldToScreen(x, y)
    if (this.kiuchiSprite?.complete && this.kiuchiSprite.naturalWidth > 0) {
      const frameWidth = this.kiuchiSprite.naturalWidth / 4
      const frameHeight = this.kiuchiSprite.naturalHeight / 3
      ctx.drawImage(this.kiuchiSprite, 0, frameHeight, frameWidth, frameHeight, screen.x - 4, screen.y - 28, 48, 64)
      return
    }
    ctx.save()
    ctx.fillStyle = '#17243d'
    ctx.fillRect(screen.x + 8, screen.y + 12, 24, 25)
    ctx.fillStyle = '#d5a36f'
    ctx.fillRect(screen.x + 12, screen.y + 3, 16, 13)
    ctx.fillStyle = '#b22b28'
    ctx.fillRect(screen.x + 19, screen.y + 16, 3, 16)
    ctx.restore()
  }

  private loadImage(path: string): HTMLImageElement | undefined {
    if (typeof Image === 'undefined') return undefined
    const image = new Image()
    image.src = `${import.meta.env.BASE_URL}${path}`
    return image
  }

  private renderTimeOverlay(ctx: CanvasRenderingContext2D, timeSlot: TimeSlot): void {
    const overlay = OVERLAYS[timeSlot]
    if (!overlay) return
    ctx.fillStyle = overlay
    ctx.fillRect(0, 0, this.camera.viewportWidth, this.camera.viewportHeight)
  }
}
