import type { GameState, Scene } from '@/types'
import { GameEngine } from '@/core/GameEngine'
import { MapScene } from './MapScene'

export class TitleScene implements Scene {
  constructor(private readonly getEngine: () => GameEngine) {}

  enter(state: GameState): void {
    state.mode = 'title'
  }

  exit(): void {}

  update(): void {}

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#1a202c'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    ctx.fillStyle = '#edf2f7'
    ctx.font = 'bold 40px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('KIUCHI QUEST', ctx.canvas.width / 2, 130)

    ctx.font = '24px sans-serif'
    ctx.fillStyle = '#f6e05e'
    ctx.fillText('NEW GAME', ctx.canvas.width / 2, 220)

    ctx.font = '14px sans-serif'
    ctx.fillStyle = '#a0aec0'
    ctx.fillText('Press Enter', ctx.canvas.width / 2, 260)
  }

  handleInput(key: string, state: GameState): void {
    if (key !== 'Enter') return

    state.player.x = 300
    state.player.y = 180
    state.currentMap = 'start'
    this.getEngine().changeScene(new MapScene())
  }
}
