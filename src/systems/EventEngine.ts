import { HealthSystem } from '@/systems/HealthSystem'
import type { EventChoice, EventDef, EventEffect, GameState, HealthStats, TimeSlot } from '@/types'

export interface EventResult {
  state: GameState
  event: EventDef
  sceneIndex: number
  text: string
  choices: EventChoice[]
  log: string[]
}

export interface EventEngineOptions {
  healthSystem?: HealthSystem
}

const TIME_ORDER: TimeSlot[] = ['morning', 'noon', 'evening', 'night']
const FULL_HEALTH: HealthStats = { blood: 0, uric: 0, chol: 0, liver: 0, sugar: 0 }

export class EventEngine {
  private healthSystem: HealthSystem

  constructor(private events: EventDef[] = [], options: EventEngineOptions = {}) {
    this.healthSystem = options.healthSystem ?? new HealthSystem()
  }

  setEvents(events: EventDef[]): void {
    this.events = events
  }

  findEvents(triggerType: EventDef['trigger']['type'], value?: string | number, state?: GameState): EventDef[] {
    return this.events.filter((event) => {
      if (event.trigger.type !== triggerType) return false
      if (value !== undefined && event.trigger.value !== value) return false
      return state ? this.canRun(event, state) : true
    })
  }

  getAutoHospitalEvent(state: GameState): EventDef | undefined {
    if (!this.healthSystem.isDangerous(state.player.health)) return undefined
    return this.events.find((event) => event.id === 'hospital_auto_danger' && this.canRun(event, state))
      ?? this.findEvents('health', 'danger', state)[0]
  }

  run(eventId: string, state: GameState, sceneIndex = 0): EventResult {
    const event = this.events.find((candidate) => candidate.id === eventId)
    if (!event) throw new Error(`Event not found: ${eventId}`)
    if (!this.canRun(event, state)) throw new Error(`Event condition not met: ${eventId}`)
    return this.applyScene(event, state, sceneIndex)
  }

  runTrigger(triggerType: EventDef['trigger']['type'], value: string | number | undefined, state: GameState): EventResult | undefined {
    const automaticHospital = this.getAutoHospitalEvent(state)
    if (automaticHospital) return this.run(automaticHospital.id, state)

    const event = this.findEvents(triggerType, value, state)[0]
    return event ? this.run(event.id, state) : undefined
  }

  choose(result: EventResult, choiceIndex: number): EventResult {
    const choice = result.choices[choiceIndex]
    if (!choice) throw new Error(`Choice not found: ${choiceIndex}`)
    const state = this.applyEffect(result.state, choice.effect)
    return this.applyScene(result.event, state, choice.nextScene)
  }

  canRun(event: EventDef, state: GameState): boolean {
    const condition = event.condition
    if (!condition) return event.repeatable || !state.flags[event.id]
    if (!event.repeatable && state.flags[event.id]) return false
    if (condition.minLevel !== undefined && state.player.level < condition.minLevel) return false
    if (condition.dayRange && (state.day < condition.dayRange[0] || state.day > condition.dayRange[1])) return false
    if (condition.flags) {
      for (const [flag, expected] of Object.entries(condition.flags)) {
        if (state.flags[flag] !== expected) return false
      }
    }
    if (condition.health) {
      for (const [key, range] of Object.entries(condition.health) as [keyof HealthStats, { min?: number; max?: number }][]) {
        const value = state.player.health[key]
        if (range.min !== undefined && value < range.min) return false
        if (range.max !== undefined && value > range.max) return false
      }
    }
    return true
  }

  private applyScene(event: EventDef, state: GameState, sceneIndex: number): EventResult {
    const scene = event.scenes[sceneIndex]
    if (!scene) throw new Error(`Scene not found: ${event.id}#${sceneIndex}`)
    const nextState = this.applyEffect(state, scene.effect, event)
    nextState.eventLog = [...(nextState.eventLog ?? []), scene.text]
    return {
      state: nextState,
      event,
      sceneIndex,
      text: scene.text,
      choices: scene.choices ?? [],
      log: nextState.eventLog,
    }
  }

  private applyEffect(state: GameState, effect?: EventEffect, event?: EventDef): GameState {
    let next = structuredClone(state) as GameState
    if (event && !event.repeatable) next.flags[event.id] = true
    if (!effect) return next

    if (effect.setFlags) next.flags = { ...next.flags, ...effect.setFlags }
    if (effect.gold) next.player.gold += effect.gold
    if (effect.xp) next.player.xp += effect.xp
    if (effect.hp) next.player.hp = Math.min(next.player.maxHp, next.player.hp + effect.hp)
    if (effect.health) next.player.health = this.addHealth(next.player.health, effect.health)
    if (effect.save) next.lastSavedAt = { day: next.day, timeSlot: next.timeSlot, map: next.currentMap }
    if (effect.rest) {
      next.player.hp = next.player.maxHp
      next.player.belly = Math.max(0, next.player.belly - 10)
    }
    if (effect.cook) {
      next.player.belly = Math.min(100, next.player.belly + effect.cook.belly)
      next.mealLog = [...(next.mealLog ?? []), effect.cook.meal]
    }
    if (effect.hospital) next.player.health = this.healthSystem.applyHospital(next.player.health)
    if (effect.gym) {
      next.player.health = this.healthSystem.applyGym(next.player.health)
      next.gymVisits = (next.gymVisits ?? 0) + 1
      if (next.gymVisits % effect.gym.rewardEvery === 0) {
        next.player.power += effect.gym.power
        next.player.sp += effect.gym.sp
      }
    }
    if (effect.advanceTime) next = this.advanceTime(next, effect.advanceTime)
    return next
  }

  private advanceTime(state: GameState, amount: number): GameState {
    const next = structuredClone(state) as GameState
    for (let i = 0; i < amount; i += 1) {
      const index = TIME_ORDER.indexOf(next.timeSlot)
      const newIndex = (index + 1) % TIME_ORDER.length
      next.timeSlot = TIME_ORDER[newIndex]
      if (newIndex === 0) next.day += 1
    }
    return next
  }

  private addHealth(current: HealthStats, effect: Partial<HealthStats>): HealthStats {
    return this.healthSystem.applyFoodEffect(current, { ...FULL_HEALTH, ...effect })
  }
}
