export type TransitionState = 'idle' | 'fading-out' | 'fading-in'

export class Transition {
  state: TransitionState = 'idle'
  alpha = 0
  private elapsed = 0
  private callback?: () => void

  constructor(private durationMs = 500) {}

  start(onMidpoint?: () => void): void {
    this.state = 'fading-out'
    this.elapsed = 0
    this.alpha = 0
    this.callback = onMidpoint
  }

  update(deltaMs: number): void {
    if (this.state === 'idle') return
    this.elapsed += deltaMs
    const progress = Math.min(1, this.elapsed / this.durationMs)
    if (this.state === 'fading-out') {
      this.alpha = progress
      if (progress >= 1) {
        this.callback?.()
        this.callback = undefined
        this.state = 'fading-in'
        this.elapsed = 0
      }
    } else {
      this.alpha = 1 - progress
      if (progress >= 1) {
        this.state = 'idle'
        this.alpha = 0
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    if (this.alpha <= 0) return
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
  }
}
