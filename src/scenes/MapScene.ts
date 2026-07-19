import type { GameState, MapDef, Scene } from '@/types'
import { CollisionSystem } from '@/maps/CollisionSystem'
import { MapLoader } from '@/maps/MapLoader'
import { MapRenderer } from '@/maps/MapRenderer'
import { THEME } from '@/ui/themes/fantasy'

const GRID_WIDTH = 18
const GRID_HEIGHT = 12

export class MapScene implements Scene {
  private readonly loader: MapLoader
  private readonly renderer: MapRenderer
  private map?: MapDef
  private collision?: CollisionSystem

  constructor(viewportWidth = 800, viewportHeight = 600, loader = new MapLoader()) {
    this.loader = loader
    this.renderer = new MapRenderer(viewportWidth, viewportHeight)
  }

  enter(state: GameState): void {
    state.mode = 'map'
    void this.changeMap(state.currentMap, state)
  }

  exit(): void {}

  update(_dt: number, state: GameState): void {
    if (!this.collision) return
    const warp = this.collision.getWarpAt(state.player.x, state.player.y)
    if (warp) void this.changeMap(warp.targetMap, state, warp.targetX, warp.targetY)
  }

  render(ctx: CanvasRenderingContext2D, state: GameState): void {
    ctx.fillStyle = THEME.colors.bg
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    if (this.map) {
      this.renderer.render(ctx, this.map, state)
    } else {
      this.renderFallbackMap(ctx, state)
    }

    this.renderHud(ctx, state)
    ctx.fillStyle = THEME.colors.text
    ctx.font = THEME.fonts.main
    ctx.fillText('方向キー/WASD: 移動  Enter: タイトルへ戻る', 36, ctx.canvas.height - 36)
  }

  handleInput(key: string, state: GameState): void {
    const delta = this.deltaForKey(key)
    if (!delta) return
    const nextX = state.player.x + delta.x
    const nextY = state.player.y + delta.y
    if (this.collision) {
      if (this.collision.canMoveTo(nextX, nextY)) {
        state.player.x = nextX
        state.player.y = nextY
      }
      return
    }
    state.player.x = Math.max(0, Math.min(GRID_WIDTH - 1, nextX))
    state.player.y = Math.max(0, Math.min(GRID_HEIGHT - 1, nextY))
  }

  async changeMap(mapId: string, state: GameState, x = state.player.x, y = state.player.y): Promise<void> {
    try {
      this.map = await this.loader.loadMap(mapId)
      this.collision = new CollisionSystem(this.map)
      state.currentMap = mapId
      state.player.x = x
      state.player.y = y
    } catch {
      this.map = undefined
      this.collision = undefined
    }
  }

  private deltaForKey(key: string): { x: number; y: number } | null {
    if (key === 'ArrowLeft' || key === 'a') return { x: -1, y: 0 }
    if (key === 'ArrowRight' || key === 'd') return { x: 1, y: 0 }
    if (key === 'ArrowUp' || key === 'w') return { x: 0, y: -1 }
    if (key === 'ArrowDown' || key === 's') return { x: 0, y: 1 }
    return null
  }

  private renderFallbackMap(ctx: CanvasRenderingContext2D, state: GameState): void {
    const tile = 40
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? '#1f2d24' : '#24382b'
        ctx.fillRect(80 + x * tile, 110 + y * tile, tile - 2, tile - 2)
      }
    }
    ctx.fillStyle = '#ffdd59'
    ctx.fillRect(80 + state.player.x * tile + 8, 110 + state.player.y * tile + 8, 24, 24)
  }

  private renderHud(ctx: CanvasRenderingContext2D, state: GameState): void {
    const career = state.career
    ctx.save()
    ctx.fillStyle = '#130d09e8'
    ctx.strokeStyle = '#d2a352'
    ctx.lineWidth = 2
    ctx.fillRect(14, 14, ctx.canvas.width - 28, 62)
    ctx.strokeRect(14, 14, ctx.canvas.width - 28, 62)
    ctx.fillStyle = '#f2e3bd'
    ctx.font = 'bold 18px "Yu Gothic", sans-serif'
    ctx.fillText(`${career?.year ?? 1988}年　${career?.rankName ?? '新卒社員'}　Lv ${state.player.level}`, 32, 42)
    ctx.fillText(`HP ${state.player.hp}/${state.player.maxHp}`, 32, 66)
    ctx.fillStyle = '#e7b85a'
    ctx.fillText(`${state.player.gold.toLocaleString()}円`, 220, 66)
    ctx.fillText(`${state.currentMap} / Day ${state.day} / ${state.timeSlot}`, 390, 42)
    ctx.restore()
  }
}
