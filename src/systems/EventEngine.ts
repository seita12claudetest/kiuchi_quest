import type { EventCondition, EventDef, EventEffect, EventTrigger, GameState, HealthStats, Season, Weekday } from '@/types'

export interface EventContext {
  triggerType?: EventTrigger['type']
  value?: string | number
  weekday?: Weekday
  season?: Season
}

export type EventGameState = GameState & {
  inventory?: Record<string, number>
  relations?: Record<string, number>
}

const EXECUTED_FLAG_PREFIX = 'event.done.'

export class EventEngine {
  getExecutedFlag(eventId: string): string {
    return `${EXECUTED_FLAG_PREFIX}${eventId}`
  }

  isExecuted(state: GameState, eventId: string): boolean {
    return state.flags[this.getExecutedFlag(eventId)] === true
  }

  canRun(event: EventDef, state: EventGameState, context: EventContext = {}): boolean {
    if (!event.repeatable && this.isExecuted(state, event.id)) return false
    return this.matchesTrigger(event.trigger, state, context) && this.matchesCondition(event.condition, state, context)
  }

  findRunnable(events: EventDef[], state: EventGameState, context: EventContext = {}): EventDef[] {
    return events.filter(event => this.canRun(event, state, context))
  }

  markExecuted(event: EventDef, state: EventGameState): EventGameState {
    if (event.repeatable) return state
    return {
      ...state,
      flags: { ...state.flags, [this.getExecutedFlag(event.id)]: true },
    }
  }

  applyEffect(state: EventGameState, effect?: EventEffect): EventGameState {
    if (!effect) return state

    const inventory = { ...(state.inventory ?? {}) }
    for (const item of effect.items ?? []) {
      inventory[item.id] = (inventory[item.id] ?? 0) + item.qty
      if (inventory[item.id] <= 0) delete inventory[item.id]
    }

    const relations = { ...(state.relations ?? {}) }
    for (const [id, delta] of Object.entries(effect.relation ?? {})) {
      relations[id] = (relations[id] ?? 0) + delta
    }

    const health: HealthStats = { ...state.player.health }
    for (const [key, delta] of Object.entries(effect.health ?? {}) as [keyof HealthStats, number][]) {
      health[key] += delta
    }

    const maxHp = state.player.maxHp
    const hp = Math.max(0, Math.min(maxHp, state.player.hp + (effect.hp ?? 0)))

    return {
      ...state,
      flags: { ...state.flags, ...(effect.setFlags ?? {}) },
      inventory,
      relations,
      player: {
        ...state.player,
        gold: state.player.gold + (effect.gold ?? 0),
        xp: state.player.xp + (effect.xp ?? 0),
        hp,
        health,
      },
    }
  }

  matchesTrigger(trigger: EventTrigger, state: EventGameState, context: EventContext = {}): boolean {
    if (context.triggerType && context.triggerType !== trigger.type) return false

    switch (trigger.type) {
      case 'tile':
      case 'talk':
      case 'time':
        return context.value === trigger.value
      case 'flag':
        return typeof trigger.value === 'string' && state.flags[trigger.value] === true
      case 'health':
        return this.matchesHealthTrigger(trigger.value, state.player.health)
      case 'auto':
        return true
    }
  }

  matchesCondition(condition: EventCondition | undefined, state: EventGameState, context: EventContext = {}): boolean {
    if (!condition) return true

    for (const [flag, expected] of Object.entries(condition.flags ?? {})) {
      if ((state.flags[flag] ?? false) !== expected) return false
    }

    const relations = state.relations ?? {}
    for (const [id, min] of Object.entries(condition.minRelation ?? {})) {
      if ((relations[id] ?? 0) < min) return false
    }

    if (condition.minLevel !== undefined && state.player.level < condition.minLevel) return false

    if (condition.dayRange) {
      const [min, max] = condition.dayRange
      if (state.day < min || state.day > max) return false
    }

    if (condition.weekday && (!context.weekday || !condition.weekday.includes(context.weekday))) return false
    if (condition.season && (!context.season || !condition.season.includes(context.season))) return false

    if (condition.health && !this.matchesHealthCondition(condition.health, state.player.health)) return false

    return true
  }

  private matchesHealthTrigger(value: string | number | undefined, health: HealthStats): boolean {
    if (typeof value === 'number') return Object.values(health).some(stat => stat >= value)
    if (typeof value !== 'string') return true
    const [key, rawMin] = value.split(':')
    if (!(key in health)) return false
    const min = Number(rawMin)
    return Number.isFinite(min) ? health[key as keyof HealthStats] >= min : true
  }

  private matchesHealthCondition(ranges: NonNullable<EventCondition['health']>, health: HealthStats): boolean {
    return Object.entries(ranges).every(([key, range]) => {
      const value = health[key as keyof HealthStats]
      return (range.min === undefined || value >= range.min) && (range.max === undefined || value <= range.max)
    })
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
