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
  }
}
