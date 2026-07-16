import { describe, it, expect } from 'vitest'
import { BattleSystem } from '@/systems/BattleSystem'
import type { PlayerState, EnemyDef, EnemyInstance } from '@/types'

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    x: 0, y: 0, level: 1, xp: 0, nextXp: 40,
    hp: 45, maxHp: 45, power: 7, def: 2, gold: 1000,
    health: { blood: 120, uric: 5.8, chol: 190, liver: 40, sugar: 95 },
    belly: 1, special: 20,
    equipment: { weapon: null, armor: null, accessory1: null, accessory2: null },
    skills: [], sp: 0,
    ...overrides
  }
}

function makeEnemy(overrides: Partial<EnemyDef> = {}): EnemyDef {
  return {
    id: 'e1', name: 'テスト敵', hp: 20, atk: 5, def: 2,
    xp: 10, gold: 100,
    drops: [{ itemId: 'item1', rate: 0.5 }],
    healthDamage: { blood: 3, uric: 0.1, chol: 5, liver: 2, sugar: 3 },
    category: 'yokocho',
    sprite: { atlas: 'enemies', x: 0, y: 0, w: 32, h: 32 },
    ...overrides
  }
}

describe('BattleSystem', () => {
  it('should calculate player damage correctly', () => {
    const bs = new BattleSystem()
    const player = makePlayer({ power: 10 })
    const enemy = makeEnemy({ def: 3 })
    const dmg = bs.calcPlayerDamage(player, enemy)
    expect(dmg).toBeGreaterThanOrEqual(1)
    expect(dmg).toBeLessThanOrEqual(player.power + 5)
  })

  it('should calculate enemy damage correctly', () => {
    const bs = new BattleSystem()
    const player = makePlayer({ def: 4 })
    const enemy = makeEnemy({ atk: 8 })
    const dmg = bs.calcEnemyDamage(enemy, player)
    expect(dmg).toBeGreaterThanOrEqual(1)
  })

  it('should never deal less than 1 damage', () => {
    const bs = new BattleSystem()
    const player = makePlayer({ power: 1 })
    const enemy = makeEnemy({ def: 999 })
    const dmg = bs.calcPlayerDamage(player, enemy)
    expect(dmg).toBeGreaterThanOrEqual(1)
  })

  it('should apply health damage on enemy defeat', () => {
    const bs = new BattleSystem()
    const player = makePlayer()
    const enemy = makeEnemy({ healthDamage: { blood: 5, uric: 0.2, chol: 8, liver: 3, sugar: 4 } })
    const result = bs.applyVictoryHealthDamage(player, enemy)
    expect(result.health.blood).toBe(125)
    expect(result.health.uric).toBeCloseTo(6.0)
    expect(result.health.chol).toBe(198)
  })

  it('should award XP and gold on victory', () => {
    const bs = new BattleSystem()
    const player = makePlayer({ xp: 0, gold: 500 })
    const enemy = makeEnemy({ xp: 25, gold: 300 })
    const result = bs.applyVictoryRewards(player, enemy)
    expect(result.xp).toBe(25)
    expect(result.gold).toBe(800)
  })

  it('should level up when XP exceeds threshold', () => {
    const bs = new BattleSystem()
    const player = makePlayer({ xp: 35, nextXp: 40, level: 1 })
    const result = bs.checkLevelUp(player, 10)
    expect(result.level).toBe(2)
    expect(result.xp).toBe(5)
    expect(result.maxHp).toBeGreaterThan(45)
  })

  it('should handle special attack with full gauge', () => {
    const bs = new BattleSystem()
    const player = makePlayer({ special: 100, power: 10 })
    const dmg = bs.calcSpecialDamage(player)
    expect(dmg).toBe(10 * 4 + 12)
  })

  it('should fail special attack with insufficient gauge', () => {
    const bs = new BattleSystem()
    const player = makePlayer({ special: 50 })
    expect(bs.canUseSpecial(player)).toBe(false)
  })

  it('should calculate run success rate', () => {
    const bs = new BattleSystem()
    let successes = 0
    for (let i = 0; i < 1000; i++) {
      if (bs.tryRun()) successes++
    }
    expect(successes).toBeGreaterThan(500)
    expect(successes).toBeLessThan(750)
  })

  it('should apply fatten effect', () => {
    const bs = new BattleSystem()
    const player = makePlayer({ belly: 1, power: 7 })
    const result = bs.applyFatten(player)
    expect(result.belly).toBeCloseTo(1.08)
    expect(result.power).toBe(8)
    expect(result.health.blood).toBeGreaterThan(120)
  })

  it('should roll drop items with injected randomness', () => {
    const bs = new BattleSystem(() => 0.4)
    const enemy = makeEnemy({
      drops: [
        { itemId: 'common', rate: 0.5 },
        { itemId: 'rare', rate: 0.1 },
      ]
    })

    expect(bs.rollDrops(enemy)).toEqual(['common'])
  })

  it('should grant SP for each level up', () => {
    const bs = new BattleSystem()
    const player = makePlayer({ xp: 39, nextXp: 40, level: 1, sp: 2 })
    const result = bs.checkLevelUp(player, 100)

    expect(result.level).toBeGreaterThan(1)
    expect(result.sp).toBeGreaterThan(2)
  })
})
