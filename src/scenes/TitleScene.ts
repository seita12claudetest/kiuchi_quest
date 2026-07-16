import type { GameState, Scene } from '@/types'
import { Panel } from '@/ui/components/Panel'
import { THEME } from '@/ui/themes/fantasy'

const panel = new Panel()

export class TitleScene implements Scene {
  private readonly onStart: () => void

  constructor(onStart: () => void) {
    this.onStart = onStart
  }

  enter(state: GameState): void {
    state.mode = 'title'
  }

  exit(): void {}

  update(_dt: number, _state: GameState): void {}

  render(ctx: CanvasRenderingContext2D, _state: GameState): void {
    ctx.fillStyle = THEME.colors.bg
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    panel.draw(ctx, { x: 210, y: 120, w: 860, h: 420 })

    ctx.save()
    ctx.textAlign = 'center'
    ctx.fillStyle = THEME.colors.gold
    ctx.font = THEME.fonts.title
    ctx.fillText('木内の大冒険 DELUXE', ctx.canvas.width / 2, 220)
    ctx.fillStyle = THEME.colors.text
    ctx.font = '20px monospace'
    ctx.fillText('会社員 × 健康管理 × RPG', ctx.canvas.width / 2, 270)
    ctx.fillStyle = THEME.colors.accent
    ctx.fillText('Enterキーで横丁へ出発', ctx.canvas.width / 2, 360)
    ctx.fillStyle = THEME.colors.textSub
    ctx.font = THEME.fonts.small
    ctx.fillText('複数マップ / 食料 / 敵 / カジノ / ミニゲーム実装の土台', ctx.canvas.width / 2, 410)
    ctx.restore()
  }

  handleInput(key: string, _state: GameState): void {
    if (key === 'Enter' || key === ' ') this.onStart()
  }
}
