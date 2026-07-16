import type { GameState, Scene } from '@/types'
import { InputManager } from './InputManager'

export interface GameEngineOptions {
  canvas: HTMLCanvasElement
  initialState: GameState
  input?: InputManager
  targetFps?: number
}

export class GameEngine {
  readonly canvas: HTMLCanvasElement
  readonly ctx: CanvasRenderingContext2D
  readonly input: InputManager
  state: GameState
  private readonly scenes: Scene[] = []
  private readonly fixedStepMs: number
  private accumulator = 0
  private lastTime = 0
  private rafId: number | null = null

  constructor(options: GameEngineOptions) {
    const ctx = options.canvas.getContext('2d')
    if (!ctx) throw new Error('2D canvas context is not available')
    this.canvas = options.canvas
    this.ctx = ctx
    this.state = options.initialState
    this.input = options.input ?? new InputManager(globalThis.window)
    this.fixedStepMs = 1000 / (options.targetFps ?? 60)
  }

  get currentScene(): Scene | null {
    return this.scenes.length > 0 ? this.scenes[this.scenes.length - 1] : null
  }

  pushScene(scene: Scene): void {
    this.currentScene?.exit()
    this.scenes.push(scene)
    scene.enter(this.state)
  }

  popScene(): Scene | null {
    const removed = this.scenes.pop() ?? null
    removed?.exit()
    this.currentScene?.enter(this.state)
    return removed
  }

  replaceScene(scene: Scene): void {
    const removed = this.scenes.pop()
    removed?.exit()
    this.scenes.push(scene)
    scene.enter(this.state)
  }

  start(): void {
    if (this.rafId !== null) return
    this.input.attach()
    this.lastTime = performance.now()
    const loop = (time: number): void => {
      this.rafId = requestAnimationFrame(loop)
      this.tick(time)
    }
    this.rafId = requestAnimationFrame(loop)
  }

  stop(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId)
    this.rafId = null
    this.input.detach()
  }

  tick(time: number): void {
    const delta = Math.min(time - this.lastTime, 100)
    this.lastTime = time
    this.accumulator += delta
    while (this.accumulator >= this.fixedStepMs) {
      this.currentScene?.update(this.fixedStepMs / 1000, this.state)
      this.accumulator -= this.fixedStepMs
      this.input.endFrame()
    }
    this.currentScene?.render(this.ctx, this.state)
  }

  handleInput(key: string): void {
    this.currentScene?.handleInput(key, this.state)
  }
}
