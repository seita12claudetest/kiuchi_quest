import type { MapDef } from '@/types'

const mapModules = import.meta.glob('./data/*.json', { import: 'default' }) as Record<string, () => Promise<MapDef>>

export class MapLoader {
  private readonly cache = new Map<string, MapDef>()

  async loadMap(id: string): Promise<MapDef> {
    const cached = this.cache.get(id)
    if (cached) return cached

    const loader = mapModules[`./data/${id}.json`]
    if (!loader) throw new Error(`Map not found: ${id}`)

    const map = await loader()
    this.validateMap(map, id)
    this.cache.set(id, map)
    return map
  }

  clearCache(): void {
    this.cache.clear()
  }

  hasCached(id: string): boolean {
    return this.cache.has(id)
  }

  validateMap(map: MapDef, expectedId = map.id): void {
    if (!map || typeof map !== 'object') throw new Error('Invalid map data')
    if (map.id !== expectedId) throw new Error(`Map id mismatch: expected ${expectedId}, got ${map.id}`)
    if (!Number.isInteger(map.width) || map.width <= 0) throw new Error(`Invalid width for map: ${map.id}`)
    if (!Number.isInteger(map.height) || map.height <= 0) throw new Error(`Invalid height for map: ${map.id}`)
    this.validateGrid(map.tiles, map.width, map.height, 'tiles', map.id)
    this.validateGrid(map.collisions, map.width, map.height, 'collisions', map.id)
    if (!Array.isArray(map.npcs)) throw new Error(`Invalid npcs for map: ${map.id}`)
    if (!Array.isArray(map.warps)) throw new Error(`Invalid warps for map: ${map.id}`)
    if (typeof map.encounterRate !== 'number' || map.encounterRate < 0 || map.encounterRate > 1) {
      throw new Error(`Invalid encounterRate for map: ${map.id}`)
    }
    if (!Array.isArray(map.enemyPool)) throw new Error(`Invalid enemyPool for map: ${map.id}`)
  }

  private validateGrid(grid: unknown[][], width: number, height: number, name: string, mapId: string): void {
    if (!Array.isArray(grid) || grid.length !== height) throw new Error(`Invalid ${name} height for map: ${mapId}`)
    grid.forEach((row, y) => {
      if (!Array.isArray(row) || row.length !== width) {
        throw new Error(`Invalid ${name} width at row ${y} for map: ${mapId}`)
      }
    })
  }
}
