import { describe, expect, it, vi } from 'vitest'
import { FishingScene } from '@/scenes/FishingScene'
import type { FishDef } from '@/types'
import { makeSaveData } from '../helpers'

const testFish: FishDef = {
  id: 'test_fish', name: 'テスト魚', icon: '🐟', rarity: 1,
  size: [10, 20], sellPrice: 100, timeSlots: ['morning'], seasons: ['spring'],
  locations: ['river'], difficulty: 1,
}

describe('FishingScene', () => {
  it('animates a timing gauge', () => {
    const save = makeSaveData()
    const scene = new FishingScene({ location: 'river', season: 'spring', save, pool: [testFish] })
    scene.enter(save.state)
    const before = scene.getGaugeValue()
    scene.update(0.25, save.state)
    expect(scene.getGaugeValue()).toBeGreaterThan(before)
  })

  it('registers caught fish in dex and inventory', () => {
    const save = makeSaveData()
    const scene = new FishingScene({ location: 'river', season: 'spring', save, pool: [testFish] })
    vi.spyOn(Math, 'random').mockReturnValue(0)
    scene.enter(save.state)
    scene.update(0.25, save.state)
    scene.handleInput('Enter', save.state)
    vi.restoreAllMocks()

    expect(save.inventory['fish:test_fish']).toBe(1)
    expect(save.dex.fish.test_fish.caught).toBe(1)
    expect(save.fishLog.test_fish.maxSize).toBeGreaterThanOrEqual(10)
  })

  it('sells caught fish for gold', () => {
    const save = makeSaveData({ inventory: { 'fish:test_fish': 1 }, dex: { enemies: {}, items: {}, fish: { test_fish: { caught: 1, maxSize: 20 } }, food: {} } })
    const scene = new FishingScene({ location: 'river', season: 'spring', save, pool: [testFish] })
    const price = scene.sellFish('test_fish')

    expect(price).toBeGreaterThan(0)
    expect(save.inventory['fish:test_fish']).toBeUndefined()
    expect(save.state.player.gold).toBe(price)
  })
})
