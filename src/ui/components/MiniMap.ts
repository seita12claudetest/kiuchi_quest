import { fantasyTheme, type FantasyTheme } from '../themes/fantasy'
import { Panel, type Rect } from './Panel'

export type MapPoint = { x: number; y: number; color?: string; radius?: number }
export type MiniMapState = { mapWidth: number; mapHeight: number; player: MapPoint; points?: MapPoint[] }

export class MiniMap {
  constructor(private rect: Rect, private state: MiniMapState, private theme: FantasyTheme = fantasyTheme) {}

  project(point: MapPoint): MapPoint {
    return {
      x: this.rect.x + (point.x / this.state.mapWidth) * this.rect.width,
      y: this.rect.y + (point.y / this.state.mapHeight) * this.rect.height,
      color: point.color,
      radius: point.radius,
    }
  }

  setState(state: MiniMapState): void {
    this.state = state
  }

  draw(ctx: CanvasRenderingContext2D): void {
    new Panel({ ...this.rect, title: 'MAP', theme: this.theme }).draw(ctx)
    const drawPoint = (point: MapPoint) => {
      const p = this.project(point)
      ctx.save()
      ctx.fillStyle = p.color ?? this.theme.colors.gold
      ctx.shadowColor = ctx.fillStyle.toString()
      ctx.shadowBlur = 6
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius ?? 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
    this.state.points?.forEach(drawPoint)
    drawPoint({ ...this.state.player, color: this.theme.colors.danger, radius: 5 })
  }
}
