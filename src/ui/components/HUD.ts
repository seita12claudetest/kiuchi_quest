import type { GameState } from '@/types'
import { Panel } from './Panel'
import { THEME } from '../themes/fantasy'

const panel = new Panel()

export class HUD {
  draw(ctx: CanvasRenderingContext2D, state: GameState, width: number): void {
    panel.draw(ctx, { x: 16, y: 16, w: width - 32, h: 64 })
    ctx.save()
    ctx.fillStyle = THEME.colors.text
    ctx.font = THEME.fonts.main
    ctx.fillText(`Lv ${state.player.level}`, 36, 52)
    ctx.fillText(`HP ${state.player.hp}/${state.player.maxHp}`, 120, 52)
    ctx.fillStyle = THEME.colors.gold
    ctx.fillText(`${state.player.gold}G`, 260, 52)
    ctx.fillStyle = THEME.colors.accent
    ctx.fillText(`${state.currentMap} / Day ${state.day} ${state.timeSlot}`, 380, 52)
    ctx.restore()
  }
}
