import { describe, expect, it } from 'vitest'
import { EventEngine } from '@/systems/EventEngine'
import { facilityEvents } from '@/data/events'
import type { GameState } from '@/types'

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    currentMap: 'town',
    day: 1,
    timeSlot: 'morning',
    flags: {},
    mode: 'map',
    player: {
      x: 0,
      y: 0,
      level: 1,
      xp: 0,
      nextXp: 10,
      hp: 20,
      maxHp: 30,
      power: 5,
      def: 3,
      gold: 100,
      health: { blood: 120, uric: 5.8, chol: 190, liver: 40, sugar: 95 },
      belly: 50,
      special: 0,
      equipment: { weapon: null, armor: null, accessory1: null, accessory2: null },
      skills: [],
      sp: 0,
    },
    ...overrides,
  }
}

describe('EventEngine', () => {
  it('runs tile-triggered home choices through EventDef scenes', () => {
    const engine = new EventEngine(facilityEvents)
    const menu = engine.runTrigger('tile', 'home', makeState())

    expect(menu?.event.id).toBe('home_facility')
    expect(menu?.choices.map((choice) => choice.label)).toEqual(['休息する', '料理する', 'セーブする', '食事ログを見る'])

    const rested = engine.choose(menu!, 0)
    expect(rested.state.player.hp).toBe(30)
    expect(rested.state.timeSlot).toBe('noon')
  })

  it('advances to the next day after night facility use', () => {
    const engine = new EventEngine(facilityEvents)
    const result = engine.run('hospital_treatment', makeState({ timeSlot: 'night' }))

    expect(result.state.timeSlot).toBe('morning')
    expect(result.state.day).toBe(2)
  })

  it('auto-fires hospital event before normal tile events when health is dangerous', () => {
    const engine = new EventEngine(facilityEvents)
    const result = engine.runTrigger('tile', 'gym', makeState({ player: { ...makeState().player, health: { blood: 170, uric: 5.8, chol: 190, liver: 40, sugar: 95 } } }))

    expect(result?.event.id).toBe('hospital_auto_danger')
    expect(result?.state.flags.autoHospitalVisited).toBe(true)
    expect(result?.state.player.health.blood).toBe(158)
  })
})
