import { fish as defaultFishPool } from '@/data/fish'
import { FishingSystem } from '@/systems/FishingSystem'
import type { FishDef, GameState, SaveData, Scene, Season } from '@/types'

export interface FishingSceneOptions {
  location: string
  season: Season
  save: SaveData
  pool?: FishDef[]
}

export class FishingScene implements Scene {
  private readonly fishing = new FishingSystem()
  private readonly location: string
  private readonly season: Season
  private readonly save: SaveData
  private readonly pool: FishDef[]
  private gauge = 0
  private gaugeDirection: 1 | -1 = 1
  private message = 'タイミングよく決定キーを押そう！'
  private hookedFish: FishDef | null = null

  constructor(options: FishingSceneOptions) {
    this.location = options.location
    this.season = options.season
    this.save = options.save
    this.pool = options.pool ?? defaultFishPool
  }

  enter(state: GameState): void {
    state.mode = 'fishing'
    this.gauge = 0
    this.gaugeDirection = 1
    this.hookedFish = this.fishing.drawFish(this.pool, state.timeSlot, this.season, this.location)
    this.message = this.hookedFish ? `${this.hookedFish.name}の気配がする…` : 'ここでは今は魚がいないようだ'
  }

  exit(): void {
    this.hookedFish = null
  }

  update(dt: number): void {
    this.gauge += this.gaugeDirection * dt * 1.8
    if (this.gauge >= 1) {
      this.gauge = 1
      this.gaugeDirection = -1
    }
    if (this.gauge <= 0) {
      this.gauge = 0
      this.gaugeDirection = 1
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save()
    ctx.fillStyle = '#102030'
    ctx.fillRect(20, 20, 280, 100)
    ctx.fillStyle = '#ffffff'
    ctx.fillText('Fishing', 32, 44)
    ctx.fillText(this.message, 32, 68)

    ctx.strokeStyle = '#ffffff'
    ctx.strokeRect(32, 84, 220, 18)
    ctx.fillStyle = '#2ecc71'
    ctx.fillRect(34, 86, 216 * this.gauge, 14)
    ctx.fillStyle = '#f1c40f'
    ctx.fillRect(32 + 220 * 0.35, 82, 220 * 0.3, 22)
    ctx.restore()
  }

  handleInput(key: string): void {
    if (key !== 'Enter' && key !== 'Space' && key !== ' ') return
    if (!this.hookedFish) return

    const caught = this.fishing.attemptCatch(this.hookedFish.difficulty, this.gauge)
    if (!caught) {
      this.message = `${this.hookedFish.name}に逃げられた…`
      this.hookedFish = null
      return
    }

    const size = this.fishing.generateSize(this.hookedFish)
    this.registerCatch(this.hookedFish, size)
    this.message = `${this.hookedFish.name}を釣り上げた！ (${size.toFixed(1)}cm)`
    this.hookedFish = null
  }

  getGaugeValue(): number {
    return this.gauge
  }

  getMessage(): string {
    return this.message
  }

  sellFish(fishId: string, size?: number): number {
    const itemId = `fish:${fishId}`
    if ((this.save.inventory[itemId] ?? 0) <= 0) return 0
    const fish = this.pool.find(f => f.id === fishId)
    if (!fish) return 0
    this.save.inventory[itemId] -= 1
    if (this.save.inventory[itemId] <= 0) delete this.save.inventory[itemId]
    const recordSize = size ?? this.save.dex.fish[fishId]?.maxSize ?? fish.size[0]
    const price = this.fishing.calcSellPrice(fish, recordSize)
    this.save.state.player.gold += price
    return price
  }

  private registerCatch(fish: FishDef, size: number): void {
    const itemId = `fish:${fish.id}`
    this.save.inventory[itemId] = (this.save.inventory[itemId] ?? 0) + 1
    const previous = this.save.dex.fish[fish.id] ?? { caught: 0, maxSize: 0 }
    const record = { caught: previous.caught + 1, maxSize: Math.max(previous.maxSize, size) }
    this.save.dex.fish[fish.id] = record
    this.save.fishLog[fish.id] = record
  }
}
