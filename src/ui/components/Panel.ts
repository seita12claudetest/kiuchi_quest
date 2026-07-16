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
}
