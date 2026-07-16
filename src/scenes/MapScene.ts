import type { GameState, Scene } from '@/types'

const PLAYER_SIZE = 24
const PLAYER_SPEED = 120

export class MapScene implements Scene {
  private dx = 0
  private dy = 0

  enter(state: GameState): void {
    state.mode = 'map'
  }

  exit(): void {
    this.dx = 0
    this.dy = 0
  }

  update(dt: number, state: GameState): void {
    state.player.x = Math.max(0, Math.min(640 - PLAYER_SIZE, state.player.x + this.dx * PLAYER_SPEED * dt))
    state.player.y = Math.max(0, Math.min(360 - PLAYER_SIZE, state.player.y + this.dy * PLAYER_SPEED * dt))
    this.dx = 0
    this.dy = 0
  }

  render(ctx: CanvasRenderingContext2D, state: GameState): void {
    ctx.fillStyle = '#2f855a'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    ctx.fillStyle = '#276749'
    for (let x = 0; x < ctx.canvas.width; x += 64) {
      ctx.fillRect(x, 0, 2, ctx.canvas.height)
    }
    for (let y = 0; y < ctx.canvas.height; y += 64) {
      ctx.fillRect(0, y, ctx.canvas.width, 2)
    }

    ctx.fillStyle = '#f6ad55'
    ctx.fillRect(state.player.x, state.player.y, PLAYER_SIZE, PLAYER_SIZE)
  }

  handleInput(key: string): void {
    if (key === 'ArrowUp') this.dy -= 1
    if (key === 'ArrowDown') this.dy += 1
    if (key === 'ArrowLeft') this.dx -= 1
    if (key === 'ArrowRight') this.dx += 1
  }
}
