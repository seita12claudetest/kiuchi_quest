import type { GameState, Scene } from '@/types'
import { HUD } from '@/ui/components/HUD'
import { THEME } from '@/ui/themes/fantasy'

const TILE = 40
const hud = new HUD()

export class MapScene implements Scene {
  enter(state: GameState): void {
    state.mode = 'map'
  }

  exit(): void {}

  update(_dt: number, _state: GameState): void {}

  render(ctx: CanvasRenderingContext2D, state: GameState): void {
    ctx.fillStyle = THEME.colors.bg
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    for (let y = 0; y < 12; y++) {
      for (let x = 0; x < 18; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? '#1f2d24' : '#24382b'
        ctx.fillRect(80 + x * TILE, 110 + y * TILE, TILE - 2, TILE - 2)
      }
    }

    ctx.fillStyle = '#ffdd59'
    ctx.fillRect(80 + state.player.x * TILE + 8, 110 + state.player.y * TILE + 8, 24, 24)

    hud.draw(ctx, state, ctx.canvas.width)

    ctx.fillStyle = THEME.colors.text
    ctx.font = THEME.fonts.main
    ctx.fillText('方向キー/WASD: 移動  Enter: タイトルへ戻る', 36, ctx.canvas.height - 36)
  }

  handleInput(key: string, state: GameState): void {
    if (key === 'ArrowLeft' || key === 'a') state.player.x = Math.max(0, state.player.x - 1)
    if (key === 'ArrowRight' || key === 'd') state.player.x = Math.min(17, state.player.x + 1)
    if (key === 'ArrowUp' || key === 'w') state.player.y = Math.max(0, state.player.y - 1)
    if (key === 'ArrowDown' || key === 's') state.player.y = Math.min(11, state.player.y + 1)
  }
}
