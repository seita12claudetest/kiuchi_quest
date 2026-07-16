import { describe, expect, it } from 'vitest'
import { MapLoader } from '@/maps/MapLoader'

describe('MapLoader', () => {
  it('loads a MapDef json file', async () => {
    const loader = new MapLoader()
    const map = await loader.loadMap('yokocho')
    expect(map.id).toBe('yokocho')
    expect(map.tiles).toHaveLength(map.height)
    expect(map.collisions[0]).toHaveLength(map.width)
  })

  it('returns cached maps on repeated loads', async () => {
    const loader = new MapLoader()
    const first = await loader.loadMap('home')
    const second = await loader.loadMap('home')
    expect(second).toBe(first)
    expect(loader.hasCached('home')).toBe(true)
  })

  it('rejects unknown maps', async () => {
    await expect(new MapLoader().loadMap('missing')).rejects.toThrow('Map not found')
  })

  it('validates grid dimensions', () => {
    const loader = new MapLoader()
    expect(() => loader.validateMap({ id: 'bad', name: 'bad', width: 2, height: 2, tiles: [[0]], collisions: [[false], [false]], npcs: [], warps: [], encounterRate: 0, enemyPool: [] })).toThrow('Invalid tiles')
  })
})
