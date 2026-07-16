import { EventEngine, type EventResult } from '@/systems/EventEngine'
import type { EventDef, GameState } from '@/types'

export class EventScene {
  private currentResult?: EventResult

  constructor(private engine: EventEngine) {}

  loadEvents(events: EventDef[]): void {
    this.engine.setEvents(events)
  }

  startEvent(eventId: string, state: GameState): EventResult {
    this.currentResult = this.engine.run(eventId, state)
    return this.currentResult
  }

  startFacilityEvent(facilityId: 'home' | 'hospital' | 'gym', state: GameState): EventResult | undefined {
    this.currentResult = this.engine.runTrigger('tile', facilityId, state)
    return this.currentResult
  }

  choose(choiceIndex: number): EventResult {
    if (!this.currentResult) throw new Error('No active event')
    this.currentResult = this.engine.choose(this.currentResult, choiceIndex)
    return this.currentResult
  }

  getCurrentResult(): EventResult | undefined {
    return this.currentResult
  }
}
