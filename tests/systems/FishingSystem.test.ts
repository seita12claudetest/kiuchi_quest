import { describe, it, expect } from 'vitest'
import { FishingSystem } from '@/systems/FishingSystem'
import type { FishDef, TimeSlot, Season } from '@/types'

function makeFish(overrides: Partial<FishDef> = {}): FishDef {
  return {
    id: 'f1', name: 'テスト魚', icon: '🐟', rarity: 1,
    size: [10, 30], sellPrice: 50, timeSlots: ['morning', 'noon'],
    seasons: ['spring', 'summer'], locations: ['park_pond'],
    difficulty: 3, ...overrides
  }
}

describe('FishingSystem', () => {
  it('should filter available fish by time and season', () => {
    const fs = new FishingSystem()
    const pool: FishDef[] = [
      makeFish({ id: 'f1', timeSlots: ['morning'], seasons: ['spring'] }),
      makeFish({ id: 'f2', timeSlots: ['night'], seasons: ['winter'] }),
      makeFish({ id: 'f3', timeSlots: ['morning', 'night'], seasons: ['spring', 'winter'] })
    ]
    const available = fs.getAvailableFish(pool, 'morning', 'spring', 'park_pond')
    expect(available.map(f => f.id)).toContain('f1')
    expect(available.map(f => f.id)).not.toContain('f2')
    expect(available.map(f => f.id)).toContain('f3')
  })

  it('should generate fish size within range', () => {
    const fs = new FishingSystem()
    const fish = makeFish({ size: [15, 45] })
    for (let i = 0; i < 100; i++) {
      const size = fs.generateSize(fish)
      expect(size).toBeGreaterThanOrEqual(15)
      expect(size).toBeLessThanOrEqual(45)
    }
  })

  it('should calculate catch difficulty check', () => {
    const fs = new FishingSystem()
    // difficulty 1 = almost always catchable, 10 = very hard
    let easy = 0, hard = 0
    for (let i = 0; i < 1000; i++) {
      if (fs.attemptCatch(1, 0.5)) easy++
      if (fs.attemptCatch(10, 0.5)) hard++
    }
    expect(easy).toBeGreaterThan(hard)
    expect(easy).toBeGreaterThan(700)
  })

  it('should calculate sell price based on size and rarity', () => {
    const fs = new FishingSystem()
    const fish = makeFish({ sellPrice: 100, rarity: 3 })
    const price = fs.calcSellPrice(fish, 35)
    expect(price).toBeGreaterThan(100)
  })

  it('should not allow fishing at invalid locations', () => {
    const fs = new FishingSystem()
    const pool: FishDef[] = [makeFish({ locations: ['park_pond'] })]
    const available = fs.getAvailableFish(pool, 'morning', 'spring', 'casino')
    expect(available).toHaveLength(0)
  })
})
