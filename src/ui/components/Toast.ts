import { fantasyTheme, type FantasyTheme } from '../themes/fantasy'

export type ToastKind = 'item' | 'level' | 'fish' | 'quest'
export type ToastMessage = { id: number; kind: ToastKind; text: string; ageMs: number; durationMs: number }

const labels: Record<ToastKind, string> = {
  item: 'アイテム獲得',
  level: 'レベルアップ',
  fish: '釣果',
  quest: 'クエスト達成',
}

export class Toast {
  private nextId = 1
  readonly messages: ToastMessage[] = []

  constructor(private theme: FantasyTheme = fantasyTheme) {}

  push(kind: ToastKind, text: string, durationMs = 3000): ToastMessage {
    const message = { id: this.nextId++, kind, text: `${labels[kind]}: ${text}`, ageMs: 0, durationMs }
    this.messages.push(message)
    return message
  }

  update(deltaMs: number): void {
    this.messages.forEach(message => { message.ageMs += deltaMs })
    for (let i = this.messages.length - 1; i >= 0; i--) {
      if (this.messages[i].ageMs >= this.messages[i].durationMs) this.messages.splice(i, 1)
    }
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    this.messages.forEach((message, index) => {
      const alpha = Math.min(1, (message.durationMs - message.ageMs) / 400)
      ctx.save()
      ctx.globalAlpha = Math.max(0, alpha)
      ctx.fillStyle = this.theme.colors.toast
      ctx.strokeStyle = this.theme.colors.gold
      ctx.fillRect(x, y + index * 42, 300, 34)
      ctx.strokeRect(x, y + index * 42, 300, 34)
      ctx.fillStyle = this.theme.colors.text
      ctx.font = this.theme.font.body
      ctx.shadowColor = this.theme.colors.glow
      ctx.shadowBlur = this.theme.metrics.glowBlur
      ctx.fillText(message.text, x + 12, y + 23 + index * 42)
      ctx.restore()
    })
  }
}
