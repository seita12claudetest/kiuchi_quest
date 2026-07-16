import type { GameState, MapDef, Scene } from '@/types'
import { CollisionSystem } from '@/maps/CollisionSystem'
import { MapLoader } from '@/maps/MapLoader'
import { MapRenderer } from '@/maps/MapRenderer'

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
    void this.changeMap(state.currentMap, state)
  }

  exit(): void {}

  update(_dt: number, state: GameState): void {
    if (!this.map || !this.collision) return
    const warp = this.collision.getWarpAt(state.player.x, state.player.y)
    if (warp) void this.changeMap(warp.targetMap, state, warp.targetX, warp.targetY)
  }

  render(ctx: CanvasRenderingContext2D, state: GameState): void {
    if (this.map) this.renderer.render(ctx, this.map, state)
  }

  handleInput(key: string, state: GameState): void {
    if (!this.collision) return
    const delta = this.deltaForKey(key)
    if (!delta) return
    const nextX = state.player.x + delta.x
    const nextY = state.player.y + delta.y
    if (this.collision.canMoveTo(nextX, nextY)) {
      state.player.x = nextX
      state.player.y = nextY
    }
  }

  async changeMap(mapId: string, state: GameState, x = state.player.x, y = state.player.y): Promise<void> {
    this.map = await this.loader.loadMap(mapId)
    this.collision = new CollisionSystem(this.map)
    state.currentMap = mapId
    state.player.x = x
    state.player.y = y
  }

  private deltaForKey(key: string): { x: number; y: number } | undefined {
    switch (key) {
      case 'ArrowUp': case 'w': return { x: 0, y: -1 }
      case 'ArrowDown': case 's': return { x: 0, y: 1 }
      case 'ArrowLeft': case 'a': return { x: -1, y: 0 }
      case 'ArrowRight': case 'd': return { x: 1, y: 0 }
      default: return undefined
    }
  }
}
