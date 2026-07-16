import { describe, expect, it } from 'vitest'
import { BattleScene } from '@/scenes/BattleScene'
import type { EnemyDef, GameState, PlayerState } from '@/types'

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    x: 0, y: 0, level: 1, xp: 35, nextXp: 40,
    hp: 45, maxHp: 45, power: 20, def: 2, gold: 100,
    health: { blood: 120, uric: 5.8, chol: 190, liver: 40, sugar: 95 },
    belly: 1, special: 100,
    equipment: { weapon: null, armor: null, accessory1: null, accessory2: null },
    skills: ['二郎斬り'], sp: 0,
    ...overrides,
  }
}

function makeEnemy(overrides: Partial<EnemyDef> = {}): EnemyDef {
  return {
    id: 'e1', name: 'テスト敵', hp: 10, atk: 3, def: 1,
    xp: 10, gold: 50,
    drops: [{ itemId: 'drop1', rate: 1 }],
    healthDamage: { blood: 3, uric: 0.1, chol: 5, liver: 2, sugar: 3 },
    category: 'yokocho',
    sprite: { atlas: 'enemies', x: 0, y: 0, w: 32, h: 32 },
    ...overrides,
  }
}

describe('BattleScene', () => {
  it('displays hp, log, turn, commands, and boss cinematic flag', () => {
    const scene = new BattleScene(makePlayer(), makeEnemy({ boss: true }))
    const display = scene.getDisplayState()

    expect(display.enemyHp).toBe(10)
    expect(display.playerHp).toBe(45)
    expect(display.turn).toBe(1)
    expect(display.log[0]).toContain('現れた')
    expect(display.commands).toEqual(['attack', 'skill', 'item', 'fatten', 'special', 'run'])
    expect(display.bossCinematic).toBe(true)
  })

  it('applies victory rewards, drops, health damage, and level up SP', () => {
    const scene = new BattleScene(makePlayer(), makeEnemy(), { rng: () => 0 })
    const result = scene.executeCommand('attack')

    expect(result.status).toBe('victory')
    expect(result.player.gold).toBe(150)
    expect(result.player.level).toBe(2)
    expect(result.player.sp).toBe(1)
    expect(result.player.health.blood).toBe(123)
    expect(result.victory?.drops).toEqual(['drop1'])
    expect(result.victory?.leveledUp).toBe(true)
  })

  it('handles skill, item, fatten, special, and run commands', () => {
    expect(new BattleScene(makePlayer(), makeEnemy({ hp: 100 }), { rng: () => 0.9 }).executeCommand('skill').battle.enemy.hp).toBe(60)
    expect(new BattleScene(makePlayer({ hp: 20 }), makeEnemy({ hp: 100 }), { rng: () => 0.9 }).executeCommand('item').player.hp).toBe(36)
    expect(new BattleScene(makePlayer(), makeEnemy({ hp: 100 }), { rng: () => 0.9 }).executeCommand('fatten').player.power).toBe(21)
    expect(new BattleScene(makePlayer(), makeEnemy({ hp: 100 }), { rng: () => 0.9 }).executeCommand('special').player.special).toBe(0)
    expect(new BattleScene(makePlayer(), makeEnemy({ hp: 100 }), { rng: () => 0 }).executeCommand('run').status).toBe('escaped')
  })

  it('returns home or hospital on defeat', () => {
    const home = new BattleScene(makePlayer({ hp: 1, def: 0 }), makeEnemy({ hp: 100, atk: 20 }), { rng: () => 0 })
    expect(home.executeCommand('attack').destination).toBe('home')

    const hospital = new BattleScene(makePlayer({ hp: 1, def: 0, health: { blood: 170, uric: 5, chol: 180, liver: 40, sugar: 95 } }), makeEnemy({ hp: 100, atk: 20 }), { rng: () => 0 })
    expect(hospital.executeCommand('attack').destination).toBe('hospital')
  })

  it('applies battle scene result to game state flags and map', () => {
    const scene = new BattleScene(makePlayer({ hp: 1, def: 0 }), makeEnemy({ hp: 100, atk: 20, boss: true }), { rng: () => 0 })
    const result = scene.executeCommand('attack')
    const gameState: GameState = { player: makePlayer(), currentMap: 'field', day: 1, timeSlot: 'morning', flags: {}, mode: 'battle' }

    const updated = scene.applyToGameState(gameState, result)

    expect(updated.currentMap).toBe('home')
    expect(updated.mode).toBe('map')
    expect(updated.flags.bossBattle).toBe(true)
  })
})
