import type { GameState, MapDef, TimeSlot } from '@/types'
import { IsoCamera } from './IsoCamera'

const TILE_TOP: Record<number, string> = {
  0: '#4d9a4d', 1: '#6a6a6a', 2: '#8a6440', 3: '#3d76bf', 4: '#caa25c', 5: '#3a3a42', 6: '#f1f1e6', 7: '#a562e8', 8: '#5f9d6c', 9: '#a9a9a9',
}
const OVERLAYS: Partial<Record<TimeSlot, string>> = { morning: 'rgba(255,180,80,0.08)', evening: 'rgba(255,100,40,0.16)', night: 'rgba(0,0,40,0.38)' }
const WALL_HEIGHT = 28

function shade(hex: string, factor: number): string {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, Math.min(255, Math.round(((n >> 16) & 0xff) * factor)))
  const g = Math.max(0, Math.min(255, Math.round(((n >> 8) & 0xff) * factor)))
  const b = Math.max(0, Math.min(255, Math.round((n & 0xff) * factor)))
  return `rgb(${r},${g},${b})`
}

/**
 * True 2:1 isometric renderer (diamond tiles + extruded walls for collision
 * tiles). Reuses the same MapDef grid/collision data as the orthogonal
 * MapRenderer — only the projection and draw order change.
 */
export class IsoMapRenderer {
  readonly camera: IsoCamera

  constructor(viewportWidth: number, viewportHeight: number, tileWidth = 64, tileHeight = 32) {
    this.camera = new IsoCamera(viewportWidth, viewportHeight, tileWidth, tileHeight, 0.25)
  }

  render(ctx: CanvasRenderingContext2D, map: MapDef, state: GameState): void {
    this.camera.follow(state.player.x, state.player.y, map.width, map.height)
    ctx.clearRect(0, 0, this.camera.viewportWidth, this.camera.viewportHeight)

    this.renderTiles(ctx, map)
    this.renderActors(ctx, map, state)

    this.renderTimeOverlay(ctx, state.timeSlot)
  }

  private renderTiles(ctx: CanvasRenderingContext2D, map: MapDef): void {
    for (let y = 0; y < map.height; y += 1) {
      for (let x = 0; x < map.width; x += 1) {
        const screen = this.camera.worldToScreen(x, y)
        if (this.offscreen(screen)) continue
        const tileId = map.tiles[y][x]
        const color = TILE_TOP[tileId] ?? '#222222'
        const wall = Boolean(map.collisions[y][x])
        this.drawDiamond(ctx, screen.x, screen.y, color)
        if (wall) this.drawWallBlock(ctx, screen.x, screen.y, color)
      }
    }
  }

  private drawDiamond(ctx: CanvasRenderingContext2D, cx: number, cy: number, color: string): void {
    const hw = this.camera.tileWidth / 2
    const hh = this.camera.tileHeight / 2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + hw, cy + hh)
    ctx.lineTo(cx, cy + hh * 2)
    ctx.lineTo(cx - hw, cy + hh)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = 'rgba(0,0,0,0.12)'
    ctx.stroke()
  }

  private drawWallBlock(ctx: CanvasRenderingContext2D, cx: number, cy: number, color: string): void {
    const hw = this.camera.tileWidth / 2
    const hh = this.camera.tileHeight / 2
    const top = cy - WALL_HEIGHT
    // left face
    ctx.beginPath()
    ctx.moveTo(cx - hw, cy + hh)
    ctx.lineTo(cx, cy + hh * 2)
    ctx.lineTo(cx, cy + hh * 2 - WALL_HEIGHT)
    ctx.lineTo(cx - hw, cy + hh - WALL_HEIGHT)
    ctx.closePath()
    ctx.fillStyle = shade(color, 0.55)
    ctx.fill()
    // right face
    ctx.beginPath()
    ctx.moveTo(cx, cy + hh * 2)
    ctx.lineTo(cx + hw, cy + hh)
    ctx.lineTo(cx + hw, cy + hh - WALL_HEIGHT)
    ctx.lineTo(cx, cy + hh * 2 - WALL_HEIGHT)
    ctx.closePath()
    ctx.fillStyle = shade(color, 0.38)
    ctx.fill()
    // top cap
    this.drawDiamond(ctx, cx, top, shade(color, 1.15))
  }

  private renderActors(ctx: CanvasRenderingContext2D, map: MapDef, state: GameState): void {
    type Actor = { x: number; y: number; draw: () => void }
    const actors: Actor[] = []

    for (const npc of map.npcs) {
      actors.push({
        x: npc.x,
        y: npc.y,
        draw: () => {
          const screen = this.camera.worldToScreen(npc.x, npc.y)
          const base = screen.y + this.camera.tileHeight
          ctx.fillStyle = 'rgba(0,0,0,0.3)'
          ctx.beginPath()
          ctx.ellipse(screen.x, base, 12, 5, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#3a2419'
          ctx.beginPath()
          ctx.arc(screen.x, base - 26, 10, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = '#d4a15d'
          ctx.fillRect(screen.x - 8, base - 20, 16, 20)
        },
      })
    }

    actors.push({
      x: state.player.x,
      y: state.player.y,
      draw: () => {
        const screen = this.camera.worldToScreen(state.player.x, state.player.y)
        const base = screen.y + this.camera.tileHeight
        ctx.fillStyle = 'rgba(0,0,0,0.35)'
        ctx.beginPath()
        ctx.ellipse(screen.x, base, 13, 6, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#17243d'
        ctx.fillRect(screen.x - 10, base - 24, 20, 22)
        ctx.fillStyle = '#d5a36f'
        ctx.beginPath()
        ctx.arc(screen.x, base - 30, 9, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#b22b28'
        ctx.fillRect(screen.x - 2, base - 20, 4, 14)
      },
    })

    actors.sort((a, b) => a.x + a.y - (b.x + b.y))
    for (const actor of actors) actor.draw()
  }

  private offscreen(screen: { x: number; y: number }): boolean {
    const margin = this.camera.tileWidth * 2
    return (
      screen.x < -margin ||
      screen.x > this.camera.viewportWidth + margin ||
      screen.y < -margin ||
      screen.y > this.camera.viewportHeight + margin
    )
  }

  private renderTimeOverlay(ctx: CanvasRenderingContext2D, timeSlot: TimeSlot): void {
    const overlay = OVERLAYS[timeSlot]
    if (!overlay) return
    ctx.fillStyle = overlay
    ctx.fillRect(0, 0, this.camera.viewportWidth, this.camera.viewportHeight)
  }
}
