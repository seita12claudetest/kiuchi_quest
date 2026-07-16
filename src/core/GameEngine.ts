import type { GameState, Scene } from '@/types'
import { InputManager, type InputSnapshot } from './InputManager'

export interface GameInput {
  attach(): void
  detach(): void
  readonly snapshot: InputSnapshot
}

export class GameEngine {
  private scene: Scene
  private animationFrameId: number | null = null
  private lastTime = 0
  private running = false

  constructor(
    private readonly canvas: HTMLCanvasElement,
    initialScene: Scene,
    private readonly state: GameState,
    private readonly input: GameInput = new InputManager()
  ) {
    this.scene = initialScene
  }

  get currentScene(): Scene {
    return this.scene
  }

  start(): void {
    if (this.running) return

    this.running = true
    this.lastTime = performance.now()
    this.input.attach()
    this.scene.enter(this.state)
    this.animationFrameId = requestAnimationFrame(this.loop)
  }

  stop(): void {
    if (!this.running) return

    this.running = false
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
    this.scene.exit()
    this.input.detach()
  }

  changeScene(nextScene: Scene): void {
    this.scene.exit()
    this.scene = nextScene
    this.scene.enter(this.state)
  }

  private readonly loop = (time: number): void => {
    if (!this.running) return

    const dt = (time - this.lastTime) / 1000
    this.lastTime = time

    this.dispatchInput()
    this.scene.update(dt, this.state)
    this.scene.render(this.context, this.state)

    this.animationFrameId = requestAnimationFrame(this.loop)
  }

  private dispatchInput(): void {
    const snapshot = this.input.snapshot
    if (snapshot.up) this.scene.handleInput('ArrowUp', this.state)
    if (snapshot.down) this.scene.handleInput('ArrowDown', this.state)
    if (snapshot.left) this.scene.handleInput('ArrowLeft', this.state)
    if (snapshot.right) this.scene.handleInput('ArrowRight', this.state)
    if (snapshot.enter) this.scene.handleInput('Enter', this.state)
    if (snapshot.escape) this.scene.handleInput('Escape', this.state)
  }

  private get context(): CanvasRenderingContext2D {
    const ctx = this.canvas.getContext('2d')
    if (!ctx) {
      throw new Error('2D canvas context is not available')
    }
    return ctx
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
