import { describe, it, expect } from 'vitest'
import { EventScene } from '@/scenes/EventScene'
import type { EventDef, PlayerState } from '@/types'
import type { EventGameState } from '@/systems/EventEngine'

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    x: 0, y: 0, level: 1, xp: 0, nextXp: 40,
    hp: 20, maxHp: 40, power: 7, def: 2, gold: 100,
    health: { blood: 120, uric: 5.8, chol: 190, liver: 40, sugar: 95 },
    belly: 1, special: 20,
    equipment: { weapon: null, armor: null, accessory1: null, accessory2: null },
    skills: [], sp: 0,
    ...overrides,
  }
}

function makeState(): EventGameState {
  return { player: makePlayer(), currentMap: 'town', day: 1, timeSlot: 'morning', flags: {}, mode: 'event', inventory: {}, relations: {} }
}

describe('EventScene', () => {
  it('processes text, speakers, choices, and effects in order', () => {
    const event: EventDef = {
      id: 'scene_event', name: 'Scene Event', type: 'story', trigger: { type: 'auto' }, repeatable: false,
      scenes: [
        { speaker: 'ガイド', text: '準備はいい？', effect: { gold: 10 } },
        { text: 'どうする？', choices: [
          { label: '休む', nextScene: 2, effect: { hp: 5, relation: { guide: 1 } } },
          { label: '進む', nextScene: 2, effect: { setFlags: { brave: true }, xp: 5 } },
        ] },
        { speaker: 'ガイド', text: '行こう。', effect: { items: [{ id: 'ticket', qty: 1 }] } },
      ],
    }

    const scene = new EventScene(event, makeState())
    expect(scene.current?.speaker).toBe('ガイド')
    expect(scene.current?.text).toBe('準備はいい？')

    scene.next()
    expect(scene.gameState.player.gold).toBe(110)
    expect(scene.current?.text).toBe('どうする？')

    scene.choose(1)
    expect(scene.gameState.flags.brave).toBe(true)
    expect(scene.gameState.player.xp).toBe(5)
    expect(scene.current?.text).toBe('行こう。')

    expect(scene.next()).toBeNull()
    expect(scene.gameState.inventory?.ticket).toBe(1)
    expect(scene.gameState.flags['event.done.scene_event']).toBe(true)
  })

  it('can run to end with a choice resolver', () => {
    const event: EventDef = {
      id: 'run_all', name: 'Run All', type: 'story', trigger: { type: 'auto' }, repeatable: true,
      scenes: [
        { text: 'A' },
        { text: 'B', choices: [{ label: 'next', nextScene: 2, effect: { gold: 5 } }] },
        { text: 'C', effect: { hp: -3 } },
      ],
    }

    const scene = new EventScene(event, makeState())
    const endState = scene.runToEnd()
    expect(endState.player.gold).toBe(105)
    expect(endState.player.hp).toBe(17)
    expect(endState.flags['event.done.run_all']).toBeUndefined()
  })
})
