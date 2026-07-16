import type { Rect } from '@/types'
import { THEME } from '../themes/fantasy'

export interface PanelOptions {
  title?: string
  fill?: string
}

export class Panel {
  draw(ctx: CanvasRenderingContext2D, rect: Rect, options: PanelOptions = {}): void {
    ctx.save()
    ctx.fillStyle = options.fill ?? THEME.colors.panel
    ctx.strokeStyle = THEME.colors.border
    ctx.lineWidth = THEME.panel.borderWidth
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h)
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h)

    ctx.strokeStyle = THEME.colors.borderLight
    ctx.lineWidth = 1
    ctx.strokeRect(rect.x + 5, rect.y + 5, rect.w - 10, rect.h - 10)

    if (options.title) {
      ctx.fillStyle = THEME.colors.gold
      ctx.font = THEME.fonts.main
      ctx.fillText(options.title, rect.x + THEME.panel.padding, rect.y + 24)
    }
    ctx.restore()
  }
import { fantasyTheme, type FantasyTheme } from '../themes/fantasy'

export type Rect = { x: number; y: number; width: number; height: number }

export type PanelOptions = Rect & {
  title?: string
  theme?: FantasyTheme
}

export function clampRatio(value: number, max: number): number {
  if (max <= 0) return 0
  return Math.max(0, Math.min(1, value / max))
}

export class Panel {
  readonly theme: FantasyTheme

  constructor(public options: PanelOptions) {
    this.theme = options.theme ?? fantasyTheme
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const { x, y, width, height, title } = this.options
    const { colors, metrics } = this.theme
    ctx.save()
    ctx.fillStyle = colors.panel
    ctx.strokeStyle = colors.gold
    ctx.lineWidth = metrics.border
    ctx.shadowColor = colors.glow
    ctx.shadowBlur = metrics.glowBlur
    this.roundRect(ctx, x, y, width, height, metrics.radius)
    ctx.fill()
    ctx.stroke()

    ctx.shadowBlur = 0
    ctx.strokeStyle = colors.goldDark
    ctx.lineWidth = 1
    this.roundRect(ctx, x + 6, y + 6, width - 12, height - 12, Math.max(0, metrics.radius - 4))
    ctx.stroke()

    if (title) {
      ctx.font = this.theme.font.title
      ctx.fillStyle = colors.text
      ctx.shadowColor = colors.glow
      ctx.shadowBlur = metrics.glowBlur
      ctx.fillText(title, x + metrics.padding, y + 28)
    }
    ctx.restore()
  }

  protected roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
  }
}
