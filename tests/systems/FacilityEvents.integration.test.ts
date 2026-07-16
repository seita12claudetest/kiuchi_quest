import { describe, expect, it } from 'vitest'
import { EventScene } from '@/scenes/EventScene'
import { EventEngine } from '@/systems/EventEngine'
import { facilityEvents } from '@/data/events'
import home from '@/maps/data/home.json'
import hospital from '@/maps/data/hospital.json'
import gym from '@/maps/data/gym.json'
import type { GameState } from '@/types'

function makeState(): GameState {
  return {
    currentMap: 'home',
    day: 3,
    timeSlot: 'noon',
    flags: {},
    mode: 'map',
    player: {
      x: 2,
      y: 2,
      level: 1,
      xp: 0,
      nextXp: 10,
      hp: 10,
      maxHp: 30,
      power: 5,
      def: 3,
      gold: 100,
      health: { blood: 150, uric: 8, chol: 250, liver: 80, sugar: 150 },
      belly: 40,
      special: 0,
      equipment: { weapon: null, armor: null, accessory1: null, accessory2: null },
      skills: [],
      sp: 0,
    },
  }
}

describe('facility events integration', () => {
  it('maps facility data to events', () => {
    expect(home.facilityEventId).toBe('home_facility')
    expect(hospital.facilityEventId).toBe('hospital_treatment')
    expect(gym.facilityEventId).toBe('gym_training')
  })

  it('supports cooking, saving, and meal log review at home', () => {
    const scene = new EventScene(new EventEngine(facilityEvents))
    const menu = scene.startFacilityEvent('home', makeState())

    const cooked = scene.choose(1)
    expect(menu?.choices).toHaveLength(4)
    expect(cooked.state.mealLog).toEqual(['家庭料理'])
    expect(cooked.state.player.belly).toBe(65)

    scene.startFacilityEvent('home', cooked.state)
    const saved = scene.choose(2)
    expect(saved.state.lastSavedAt).toEqual({ day: 3, timeSlot: 'evening', map: 'home' })

    scene.startFacilityEvent('home', saved.state)
    const log = scene.choose(3)
    expect(log.text).toContain('食事ログ')
  })

  it('improves health at the hospital with HealthSystem.applyHospital', () => {
    const scene = new EventScene(new EventEngine(facilityEvents))
    const result = scene.startFacilityEvent('hospital', makeState())

    expect(result?.state.player.health.blood).toBe(138)
    expect(result?.state.player.health.chol).toBe(240)
    expect(result?.state.timeSlot).toBe('evening')
  })

  it('uses HealthSystem.applyGym and grants rewards after repeated training', () => {
    const scene = new EventScene(new EventEngine(facilityEvents))
    const first = scene.startFacilityEvent('gym', makeState())!
    const second = scene.startFacilityEvent('gym', first.state)!

    expect(first.state.player.health.blood).toBe(144)
    expect(second.state.player.health.blood).toBe(138)
    expect(second.state.player.power).toBe(6)
    expect(second.state.player.sp).toBe(1)
  })
})
