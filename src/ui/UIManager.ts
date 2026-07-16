import { fantasyTheme, type FantasyTheme } from './themes/fantasy'
import { DialogBox } from './components/DialogBox'
import { HUD, type HUDState } from './components/HUD'
import { MenuList, type MenuTab } from './components/MenuList'
import { Toast, type ToastKind } from './components/Toast'
import { Transition } from './components/Transition'

export type UIScreen = 'map' | 'menu' | 'dialog' | 'transition'
export type UIManagerOptions = { width: number; height: number; hud: HUDState; theme?: FantasyTheme }

export class UIManager {
  screen: UIScreen = 'map'
  readonly hud: HUD
  readonly menu: MenuList
  readonly dialog: DialogBox
  readonly toast: Toast
  readonly transition: Transition
  private theme: FantasyTheme

  constructor(private options: UIManagerOptions) {
    this.theme = options.theme ?? fantasyTheme
    this.hud = new HUD(options.width, options.height, options.hud, this.theme)
    this.menu = new MenuList({ x: 40, y: 40, width: 220, height: 280 }, undefined, this.theme)
    this.dialog = new DialogBox({ x: 60, y: options.height - 160, width: options.width - 120, height: 120 }, '', 32, this.theme)
    this.toast = new Toast(this.theme)
    this.transition = new Transition()
  }

  openMenu(tab?: MenuTab): void {
    this.screen = 'menu'
    if (tab) this.menu.select(tab)
  }

  showDialog(text: string): void {
    this.screen = 'dialog'
    this.dialog.setText(text)
  }

  showMap(): void {
    this.screen = 'map'
  }

  notify(kind: ToastKind, text: string): void {
    this.toast.push(kind, text)
  }

  transitionTo(screen: UIScreen): void {
    this.screen = 'transition'
    this.transition.start(() => { this.screen = screen })
  }

  update(deltaMs: number): void {
    this.dialog.update(deltaMs)
    this.toast.update(deltaMs)
    this.transition.update(deltaMs)
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.screen === 'map') this.hud.draw(ctx, true)
    if (this.screen === 'menu') {
      this.hud.draw(ctx, false)
      this.menu.draw(ctx)
    }
    if (this.screen === 'dialog') {
      this.hud.draw(ctx, false)
      this.dialog.draw(ctx)
    }
    this.toast.draw(ctx, this.options.width - 320, this.options.height - 160)
    this.transition.draw(ctx, this.options.width, this.options.height)
  }
}
