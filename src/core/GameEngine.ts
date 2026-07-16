import type { GameState, Scene } from '@/types'
import { InputManager, type InputSnapshot } from './InputManager'

export interface GameInput {
  attach(): void
  detach(): void
  readonly snapshot: InputSnapshot
  endFrame?(): void
}

export interface GameEngineOptions {
  canvas: HTMLCanvasElement
  initialState: GameState
  input?: GameInput
  targetFps?: number
}

export class GameEngine {
  readonly canvas: HTMLCanvasElement
  readonly ctx: CanvasRenderingContext2D
  readonly input: GameInput
  state: GameState
  private scenes: Scene[] = []
  private fixedStepMs = 1000 / 60
  private accumulator = 0
  private lastTime = 0
  private rafId: number | null = null

  constructor(options: GameEngineOptions)
  constructor(canvas: HTMLCanvasElement, initialScene: Scene, state: GameState, input?: GameInput)
  constructor(optionsOrCanvas: GameEngineOptions | HTMLCanvasElement, initialScene?: Scene, state?: GameState, input?: GameInput) {
    const options = 'getContext' in optionsOrCanvas
      ? { canvas: optionsOrCanvas as HTMLCanvasElement, initialState: state as GameState, input, initialScene }
      : optionsOrCanvas
    const ctx = options.canvas.getContext('2d')
    if (!ctx) throw new Error('2D canvas context is not available')
    this.canvas = options.canvas
    this.ctx = ctx
    this.state = options.initialState
    this.input = options.input ?? new InputManager(globalThis.window)
    this.fixedStepMs = 1000 / ((options as GameEngineOptions).targetFps ?? 60)
    if ('initialScene' in options && options.initialScene) this.scenes.push(options.initialScene)
  }

  get currentScene(): Scene | null {
    return this.scenes[this.scenes.length - 1] ?? null
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
    this.changeScene(scene)
  }

  changeScene(scene: Scene): void {
    const previous = this.scenes.pop()
    previous?.exit()
    this.scenes.push(scene)
    scene.enter(this.state)
  }

  start(): void {
    if (this.rafId !== null) return
    this.input.attach()
    this.lastTime = performance.now()
    this.currentScene?.enter(this.state)
    const loop = (time: number): void => {
      this.rafId = requestAnimationFrame(loop)
      this.tick(time)
    }
    this.rafId = requestAnimationFrame(loop)
  }

  stop(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId)
    this.rafId = null
    this.currentScene?.exit()
    this.input.detach()
  }

  tick(time: number): void {
    const delta = Math.min(time - this.lastTime, 100)
    this.lastTime = time
    this.dispatchInput()
    this.accumulator += delta
    let updated = false
    while (this.accumulator >= this.fixedStepMs) {
      this.currentScene?.update(this.fixedStepMs / 1000, this.state)
      this.accumulator -= this.fixedStepMs
      updated = true
      this.input.endFrame?.()
    }
    if (!updated) this.currentScene?.update(delta / 1000, this.state)
    this.currentScene?.render(this.ctx, this.state)
  }

  handleInput(key: string): void {
    this.currentScene?.handleInput(key, this.state)
  }

  private dispatchInput(): void {
    const snapshot = this.input.snapshot
    if (snapshot.up) this.handleInput('ArrowUp')
    if (snapshot.down) this.handleInput('ArrowDown')
    if (snapshot.left) this.handleInput('ArrowLeft')
    if (snapshot.right) this.handleInput('ArrowRight')
    if (snapshot.enter) this.handleInput('Enter')
    if (snapshot.escape) this.handleInput('Escape')
  }
}
