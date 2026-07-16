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
import { fantasyTheme, type FantasyTheme } from '../themes/fantasy'
import { HealthBar, type PlayerGauges } from './HealthBar'
import { MiniMap, type MiniMapState } from './MiniMap'
import { Panel } from './Panel'

export type HUDState = { playerName: string; level: number; gauges: PlayerGauges; miniMap?: MiniMapState }

export class HUD {
  constructor(private width: number, private height: number, private state: HUDState, private theme: FantasyTheme = fantasyTheme) {}

  setState(state: HUDState): void {
    this.state = state
  }

  draw(ctx: CanvasRenderingContext2D, showMiniMap = false): void {
    new Panel({ x: 16, y: 16, width: 270, height: 126, title: `${this.state.playerName} Lv.${this.state.level}`, theme: this.theme }).draw(ctx)
    new HealthBar({ x: 34, y: 58, width: 230, height: 68 }, this.state.gauges, this.theme).draw(ctx)
    if (showMiniMap && this.state.miniMap) {
      new MiniMap({ x: this.width - 176, y: 16, width: 160, height: 120 }, this.state.miniMap, this.theme).draw(ctx)
    }
  }
}
