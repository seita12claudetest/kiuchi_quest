import { describe, expect, it } from 'vitest'
import { CollisionSystem } from '@/maps/CollisionSystem'
import type { MapDef } from '@/types'

const map: MapDef = { id: 'test', name: 'Test', width: 3, height: 3, tiles: [[0,0,0],[0,0,0],[0,0,0]], collisions: [[true,true,true],[true,false,true],[true,false,true]], npcs: [{ id: 'npc', x: 1, y: 1, sprite: { atlas: 'a', x: 0, y: 0, w: 1, h: 1 } }], warps: [{ x: 1, y: 2, targetMap: 'next', targetX: 2, targetY: 3 }], encounterRate: 0, enemyPool: [] }

describe('CollisionSystem', () => {
  it('blocks walls and out-of-bounds tiles', () => {
    const system = new CollisionSystem(map)
    expect(system.isBlocked(0, 0, false)).toBe(true)
    expect(system.isBlocked(-1, 1)).toBe(true)
  })

  it('blocks NPC tiles', () => {
    expect(new CollisionSystem(map).isBlocked(1, 1)).toBe(true)
  })

  it('detects warp points', () => {
    const warp = new CollisionSystem(map).getWarpAt(1, 2)
    expect(warp?.targetMap).toBe('next')
  })
})
