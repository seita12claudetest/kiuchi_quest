import { describe, it, expect } from 'vitest'
import { EventEngine, type EventGameState } from '@/systems/EventEngine'
import type { EventDef, PlayerState } from '@/types'

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    x: 0, y: 0, level: 3, xp: 0, nextXp: 40,
    hp: 30, maxHp: 50, power: 7, def: 2, gold: 100,
    health: { blood: 120, uric: 5.8, chol: 190, liver: 40, sugar: 95 },
    belly: 1, special: 20,
    equipment: { weapon: null, armor: null, accessory1: null, accessory2: null },
    skills: [], sp: 0,
    ...overrides,
  }
}

function makeState(overrides: Partial<EventGameState> = {}): EventGameState {
  return {
    player: makePlayer(), currentMap: 'town', day: 10, timeSlot: 'morning', flags: {}, mode: 'map',
    inventory: {}, relations: {},
    ...overrides,
  }
}

function makeEvent(overrides: Partial<EventDef> = {}): EventDef {
  return {
    id: 'event1', name: 'Event 1', type: 'story', trigger: { type: 'auto' }, repeatable: false,
    scenes: [{ text: 'hello' }],
    ...overrides,
  }
}

describe('EventEngine', () => {
  it('matches tile, talk, time, flag, health, and auto triggers', () => {
    const engine = new EventEngine()
    const state = makeState({ flags: { ready: true }, player: makePlayer({ health: { blood: 160, uric: 5.8, chol: 190, liver: 40, sugar: 95 } }) })

    expect(engine.canRun(makeEvent({ trigger: { type: 'tile', value: 'gate' } }), state, { triggerType: 'tile', value: 'gate' })).toBe(true)
    expect(engine.canRun(makeEvent({ trigger: { type: 'talk', value: 'mika' } }), state, { triggerType: 'talk', value: 'mika' })).toBe(true)
    expect(engine.canRun(makeEvent({ trigger: { type: 'time', value: 'night' } }), state, { triggerType: 'time', value: 'night' })).toBe(true)
    expect(engine.canRun(makeEvent({ trigger: { type: 'flag', value: 'ready' } }), state, { triggerType: 'flag' })).toBe(true)
    expect(engine.canRun(makeEvent({ trigger: { type: 'health', value: 'blood:150' } }), state, { triggerType: 'health' })).toBe(true)
    expect(engine.canRun(makeEvent({ trigger: { type: 'auto' } }), state, { triggerType: 'auto' })).toBe(true)
  })

  it('checks all supported conditions', () => {
    const engine = new EventEngine()
    const state = makeState({
      day: 12,
      flags: { met_mika: true, defeated: false },
      relations: { mika: 15 },
      player: makePlayer({ level: 6, health: { blood: 130, uric: 6.2, chol: 200, liver: 45, sugar: 98 } }),
    })

    const event = makeEvent({
      condition: {
        flags: { met_mika: true, defeated: false },
        minRelation: { mika: 10 },
        minLevel: 5,
        dayRange: [10, 20],
        health: { blood: { min: 120, max: 140 }, uric: { min: 6 } },
        weekday: ['fri'],
        season: ['summer'],
      },
    })

    expect(engine.canRun(event, state, { triggerType: 'auto', weekday: 'fri', season: 'summer' })).toBe(true)
    expect(engine.canRun(event, state, { triggerType: 'auto', weekday: 'mon', season: 'summer' })).toBe(false)
  })

  it('applies effects and marks non-repeatable events executed', () => {
    const engine = new EventEngine()
    const event = makeEvent({ id: 'once' })
    const state = makeState({ relations: { mika: 1 }, inventory: { apple: 1 } })

    const effected = engine.applyEffect(state, {
      setFlags: { helped: true }, gold: 50, xp: 10, items: [{ id: 'apple', qty: 2 }],
      health: { blood: -3 }, relation: { mika: 4 }, hp: 100,
    })
    const marked = engine.markExecuted(event, effected)

    expect(marked.flags.helped).toBe(true)
    expect(marked.flags['event.done.once']).toBe(true)
    expect(marked.player.gold).toBe(150)
    expect(marked.player.xp).toBe(10)
    expect(marked.inventory?.apple).toBe(3)
    expect(marked.relations?.mika).toBe(5)
    expect(marked.player.health.blood).toBe(117)
    expect(marked.player.hp).toBe(50)
    expect(engine.canRun(event, marked, { triggerType: 'auto' })).toBe(false)
  })
})
