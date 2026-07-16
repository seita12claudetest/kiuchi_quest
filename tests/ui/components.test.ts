import { describe, expect, it, vi } from 'vitest'
import { clampRatio } from '@/ui/components/Panel'
import { createPlayerGauges, HealthBar } from '@/ui/components/HealthBar'
import { DialogBox } from '@/ui/components/DialogBox'
import { MENU_TABS, MenuList } from '@/ui/components/MenuList'
import { MiniMap } from '@/ui/components/MiniMap'
import { Toast } from '@/ui/components/Toast'
import { Transition } from '@/ui/components/Transition'
import { UIManager } from '@/ui/UIManager'

function createCtx() {
  const calls: string[] = []
  const fn = (name: string) => vi.fn(() => calls.push(name))
  const ctx = {
    calls,
    save: fn('save'), restore: fn('restore'), beginPath: fn('beginPath'), moveTo: fn('moveTo'), lineTo: fn('lineTo'),
    quadraticCurveTo: fn('quadraticCurveTo'), closePath: fn('closePath'), fill: fn('fill'), stroke: fn('stroke'),
    fillRect: fn('fillRect'), strokeRect: fn('strokeRect'), fillText: fn('fillText'), arc: fn('arc'),
    fillStyle: '', strokeStyle: '', shadowColor: '', shadowBlur: 0, lineWidth: 0, font: '', globalAlpha: 1,
  }
  return ctx as unknown as CanvasRenderingContext2D & { fillRect: ReturnType<typeof vi.fn>; fillText: ReturnType<typeof vi.fn>; arc: ReturnType<typeof vi.fn> }
}

describe('Canvas UI components', () => {
  it('calculates clamped gauge fill widths for HP, EXP and special meters', () => {
    const gauges = createPlayerGauges(30, 100, 120, 100, -10)
    const bar = new HealthBar({ x: 0, y: 0, width: 200, height: 60 }, gauges)
    expect(clampRatio(150, 100)).toBe(1)
    expect(bar.getFillWidth('hp')).toBe(60)
    expect(bar.getFillWidth('exp')).toBe(200)
    expect(bar.getFillWidth('special')).toBe(0)
  })

  it('reveals dialog text with a typewriter effect and can skip to the end', () => {
    const dialog = new DialogBox({ x: 0, y: 0, width: 300, height: 100 }, '勇者よ、進め', 4)
    dialog.update(500)
    expect(dialog.visibleText).toBe('勇者')
    expect(dialog.isComplete).toBe(false)
    dialog.skip()
    expect(dialog.visibleText).toBe('勇者よ、進め')
    expect(dialog.isComplete).toBe(true)
  })

  it('keeps the required menu tabs and wraps selection state', () => {
    const menu = new MenuList({ x: 0, y: 0, width: 200, height: 200 })
    expect(MENU_TABS).toEqual(['アイテム', '装備', 'スキル', 'クエスト', '図鑑', '設定'])
    menu.move(-1)
    expect(menu.selectedTab).toBe('設定')
    menu.select('クエスト')
    expect(menu.selectedTab).toBe('クエスト')
  })

  it('projects world positions into minimap coordinates', () => {
    const minimap = new MiniMap({ x: 100, y: 50, width: 200, height: 100 }, { mapWidth: 1000, mapHeight: 500, player: { x: 250, y: 125 } })
    expect(minimap.project({ x: 500, y: 250 })).toMatchObject({ x: 200, y: 100 })
  })

  it('expires item, level, fish and quest toast notifications by duration', () => {
    const toast = new Toast()
    toast.push('item', '薬草')
    toast.push('level', 'Lv.2')
    toast.push('fish', '金のコイ')
    toast.push('quest', '森の調査')
    expect(toast.messages.map(message => message.text)).toEqual([
      'アイテム獲得: 薬草', 'レベルアップ: Lv.2', '釣果: 金のコイ', 'クエスト達成: 森の調査',
    ])
    toast.update(3000)
    expect(toast.messages).toHaveLength(0)
  })

  it('runs fade-out and fade-in transition state changes', () => {
    const midpoint = vi.fn()
    const transition = new Transition(100)
    transition.start(midpoint)
    transition.update(100)
    expect(midpoint).toHaveBeenCalledOnce()
    expect(transition.state).toBe('fading-in')
    expect(transition.alpha).toBe(1)
    transition.update(100)
    expect(transition.state).toBe('idle')
    expect(transition.alpha).toBe(0)
  })

  it('draws HUD and minimap on the map screen through UIManager', () => {
    const ctx = createCtx()
    const ui = new UIManager({
      width: 640,
      height: 360,
      hud: {
        playerName: 'キウチ',
        level: 3,
        gauges: createPlayerGauges(80, 100, 20, 50, 40),
        miniMap: { mapWidth: 1000, mapHeight: 1000, player: { x: 500, y: 500 }, points: [{ x: 100, y: 200 }] },
      },
    })
    ui.notify('quest', 'はじまりの丘')
    ui.draw(ctx)
    expect(ctx.fillText).toHaveBeenCalledWith('MAP', expect.any(Number), expect.any(Number))
    expect(ctx.arc).toHaveBeenCalled()
    expect(ctx.fillText).toHaveBeenCalledWith('クエスト達成: はじまりの丘', expect.any(Number), expect.any(Number))
  })
})
