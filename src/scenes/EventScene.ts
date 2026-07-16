import { EventEngine, type EventGameState } from '@/systems/EventEngine'
import type { EventDef, EventScene as EventSceneDef } from '@/types'

export interface EventSceneView {
  index: number
  text: string
  speaker?: string
  scene: EventSceneDef
  isComplete: boolean
}

export class EventScene {
  private index = 0
  private state: EventGameState
  private readonly engine: EventEngine

  constructor(private readonly event: EventDef, initialState: EventGameState, engine = new EventEngine()) {
    this.state = initialState
    this.engine = engine
  }

  get current(): EventSceneView | null {
    const scene = this.event.scenes[this.index]
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
    return this.state
  }

  choose(choiceIndex: number): EventSceneView | null {
    const scene = this.event.scenes[this.index]
    const choice = scene?.choices?.[choiceIndex]
    if (!scene || !choice) return this.current

    this.state = this.engine.applyEffect(this.state, choice.effect)
    this.index = choice.nextScene
    return this.current
  }

  next(): EventSceneView | null {
    const scene = this.event.scenes[this.index]
    if (!scene) return null

    this.state = this.engine.applyEffect(this.state, scene.effect)
    this.index += 1

    if (this.index >= this.event.scenes.length) {
      this.state = this.engine.markExecuted(this.event, this.state)
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
    return this.state
  }
}
