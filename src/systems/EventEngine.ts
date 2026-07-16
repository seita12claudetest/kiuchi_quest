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
  }
}
