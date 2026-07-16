import { fantasyTheme, type FantasyTheme } from '../themes/fantasy'
import { Panel, type Rect } from './Panel'

export class DialogBox {
  private elapsed = 0
  private complete = false

  constructor(private rect: Rect, private text = '', private charsPerSecond = 32, private theme: FantasyTheme = fantasyTheme) {}

  setText(text: string): void {
    this.text = text
    this.elapsed = 0
    this.complete = false
  }

  update(deltaMs: number): void {
    if (this.complete) return
    this.elapsed += deltaMs
    if (this.visibleText.length >= this.text.length) this.complete = true
  }

  skip(): void {
    this.elapsed = (this.text.length / this.charsPerSecond) * 1000
    this.complete = true
  }

  get visibleText(): string {
    const count = Math.min(this.text.length, Math.floor((this.elapsed / 1000) * this.charsPerSecond))
    return this.text.slice(0, count)
  }

  get isComplete(): boolean {
    return this.complete
  }

  draw(ctx: CanvasRenderingContext2D): void {
    new Panel({ ...this.rect, theme: this.theme }).draw(ctx)
    ctx.save()
    ctx.font = this.theme.font.body
    ctx.fillStyle = this.theme.colors.text
    ctx.shadowColor = this.theme.colors.glow
    ctx.shadowBlur = this.theme.metrics.glowBlur
    this.visibleText.split('\n').forEach((line, i) => ctx.fillText(line, this.rect.x + 18, this.rect.y + 34 + i * 24))
    ctx.restore()
  }
}
