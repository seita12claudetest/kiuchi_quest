import { fantasyTheme, type FantasyTheme } from '../themes/fantasy'
import { Panel, type Rect } from './Panel'

export const MENU_TABS = ['アイテム', '装備', 'スキル', 'クエスト', '図鑑', '設定'] as const
export type MenuTab = typeof MENU_TABS[number]

export class MenuList {
  selectedIndex = 0

  constructor(private rect: Rect, private tabs: readonly MenuTab[] = MENU_TABS, private theme: FantasyTheme = fantasyTheme) {}

  get selectedTab(): MenuTab {
    return this.tabs[this.selectedIndex]
  }

  move(delta: number): void {
    this.selectedIndex = (this.selectedIndex + delta + this.tabs.length) % this.tabs.length
  }

  select(tab: MenuTab): void {
    const index = this.tabs.indexOf(tab)
    if (index >= 0) this.selectedIndex = index
  }

  draw(ctx: CanvasRenderingContext2D): void {
    new Panel({ ...this.rect, title: 'メニュー', theme: this.theme }).draw(ctx)
    const rowHeight = 34
    this.tabs.forEach((tab, index) => {
      const y = this.rect.y + 50 + index * rowHeight
      ctx.save()
      ctx.font = this.theme.font.body
      ctx.fillStyle = index === this.selectedIndex ? this.theme.colors.gold : this.theme.colors.text
      ctx.shadowColor = this.theme.colors.glow
      ctx.shadowBlur = index === this.selectedIndex ? this.theme.metrics.glowBlur : 0
      ctx.fillText(`${index === this.selectedIndex ? '▶ ' : '  '}${tab}`, this.rect.x + 20, y)
      ctx.restore()
    })
  }
}
