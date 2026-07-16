import { fantasyTheme, type FantasyTheme } from '../themes/fantasy'
import { clampRatio, type Rect } from './Panel'

export type Gauge = { current: number; max: number; label: string; color: string }
export type PlayerGauges = { hp: Gauge; exp: Gauge; special: Gauge }

export function createPlayerGauges(hp: number, maxHp: number, exp: number, maxExp: number, special: number, maxSpecial = 100, theme: FantasyTheme = fantasyTheme): PlayerGauges {
  return {
    hp: { current: hp, max: maxHp, label: 'HP', color: theme.colors.hp },
    exp: { current: exp, max: maxExp, label: 'EXP', color: theme.colors.exp },
    special: { current: special, max: maxSpecial, label: '必殺', color: theme.colors.special },
  }
}

export class HealthBar {
  constructor(private rect: Rect, private gauges: PlayerGauges, private theme: FantasyTheme = fantasyTheme) {}

  getFillWidth(kind: keyof PlayerGauges): number {
    return Math.round(this.rect.width * clampRatio(this.gauges[kind].current, this.gauges[kind].max))
  }

  setGauges(gauges: PlayerGauges): void {
    this.gauges = gauges
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const rows = Object.values(this.gauges)
    const gap = 8
    const rowHeight = Math.floor((this.rect.height - gap * (rows.length - 1)) / rows.length)
    rows.forEach((gauge, index) => {
      const y = this.rect.y + index * (rowHeight + gap)
      ctx.save()
      ctx.fillStyle = this.theme.colors.panelLight
      ctx.fillRect(this.rect.x, y, this.rect.width, rowHeight)
      ctx.fillStyle = gauge.color
      ctx.shadowColor = gauge.color
      ctx.shadowBlur = 8
      ctx.fillRect(this.rect.x, y, Math.round(this.rect.width * clampRatio(gauge.current, gauge.max)), rowHeight)
      ctx.shadowBlur = 0
      ctx.strokeStyle = this.theme.colors.gold
      ctx.strokeRect(this.rect.x, y, this.rect.width, rowHeight)
      ctx.fillStyle = this.theme.colors.text
      ctx.font = this.theme.font.small
      ctx.fillText(`${gauge.label} ${gauge.current}/${gauge.max}`, this.rect.x + 8, y + rowHeight - 5)
      ctx.restore()
    })
  }
}
