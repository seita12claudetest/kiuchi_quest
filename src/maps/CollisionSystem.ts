import type { MapDef, MapNPC, WarpPoint } from '@/types'

export class CollisionSystem {
  constructor(private map: MapDef) {}

  setMap(map: MapDef): void {
    this.map = map
  }

  isBlocked(x: number, y: number, includeNpcs = true): boolean {
    const tileX = Math.floor(x)
    const tileY = Math.floor(y)
    if (!this.isInside(tileX, tileY)) return true
    if (this.map.collisions[tileY]?.[tileX]) return true
    return includeNpcs && this.getNpcAt(tileX, tileY) !== undefined
  }

  canMoveTo(x: number, y: number): boolean {
    return !this.isBlocked(x, y)
  }

  getNpcAt(x: number, y: number): MapNPC | undefined {
    const tileX = Math.floor(x)
    const tileY = Math.floor(y)
    return this.map.npcs.find((npc) => npc.x === tileX && npc.y === tileY)
  }

  getWarpAt(x: number, y: number): WarpPoint | undefined {
    const tileX = Math.floor(x)
    const tileY = Math.floor(y)
    return this.map.warps.find((warp) => warp.x === tileX && warp.y === tileY)
  }

  private isInside(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.map.width && y < this.map.height
  }
}
