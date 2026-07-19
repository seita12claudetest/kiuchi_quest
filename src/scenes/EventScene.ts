import { EventEngine, type EventGameState, type EventResult } from '@/systems/EventEngine'
import type { EventDef, EventScene as EventSceneDef, GameState } from '@/types'

export interface EventSceneView {
  index: number
  text: string
  speaker?: string
  scene: EventSceneDef
  isComplete: boolean
}

export class EventScene {
  private index = 0
  private state?: EventGameState
  private readonly engine: EventEngine
  private readonly event?: EventDef
  private currentResult?: EventResult

  constructor(engine: EventEngine)
  constructor(event: EventDef, initialState: EventGameState, engine?: EventEngine)
  constructor(eventOrEngine: EventDef | EventEngine, initialState?: EventGameState, engine = new EventEngine()) {
    if (eventOrEngine instanceof EventEngine) {
      this.engine = eventOrEngine
      return
    }
    this.event = eventOrEngine
    this.state = initialState
    this.engine = engine
  }

  get current(): EventSceneView | null {
    const scene = this.event?.scenes[this.index]
    if (!scene) return null
    return {
      index: this.index,
      text: scene.text,
      speaker: scene.speaker,
      scene,
      isComplete: false,
    }
  }

  get gameState(): EventGameState {
    if (!this.state) throw new Error('No direct event state')
    return this.state
  }

  choose(choiceIndex: number): EventSceneView | EventResult | null {
    if (this.currentResult) {
      this.currentResult = this.engine.choose(this.currentResult, choiceIndex)
      return this.currentResult
    }
    const scene = this.event?.scenes[this.index]
    const choice = scene?.choices?.[choiceIndex]
    if (!scene || !choice) return this.current

    this.state = this.engine.applyEffect(this.gameState, choice.effect)
    this.index = choice.nextScene
    return this.current
  }

  next(): EventSceneView | null {
    const scene = this.event?.scenes[this.index]
    if (!scene) return null

    this.state = this.engine.applyEffect(this.gameState, scene.effect)
    this.index += 1

    if (this.event && this.index >= this.event.scenes.length) {
      this.state = this.engine.markExecuted(this.event, this.gameState)
      return null
    }

    return this.current
  }

  runToEnd(choiceResolver: (scene: EventSceneDef, index: number) => number = () => 0): EventGameState {
    while (this.current) {
      const scene = this.current.scene
      if (scene.choices?.length) this.choose(choiceResolver(scene, this.index))
      else this.next()
    }
    return this.gameState
  }

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

  getCurrentResult(): EventResult | undefined {
    return this.currentResult
  }
}
