import { CasinoSystem, type BlackjackGame, type Card, type PokerResult, type RouletteBet, type RouletteResult, type SlotResult } from '@/systems/CasinoSystem'

export type CasinoMenuOption = 'slot' | 'blackjack' | 'roulette' | 'poker' | 'exchange' | 'prize' | 'exit'
export type PrizeId = 'rare_sword' | 'rare_armor' | 'mega_potion' | 'detox_tea'

export interface CasinoSceneState {
  gold: number
  casinoCoins: number
  inventory: string[]
  selectedMenu: CasinoMenuOption
  blackjack: BlackjackGame | null
}

export interface Prize {
  id: PrizeId
  name: string
  cost: number
  kind: 'equipment' | 'recovery'
}

const GOLD_TO_COIN_RATE = 10
const PRIZES: Prize[] = [
  { id: 'rare_sword', name: '開運のレアソード', cost: 1200, kind: 'equipment' },
  { id: 'rare_armor', name: '勝負師のレアアーマー', cost: 1000, kind: 'equipment' },
  { id: 'mega_potion', name: 'メガ回復薬', cost: 120, kind: 'recovery' },
  { id: 'detox_tea', name: '養生デトックス茶', cost: 80, kind: 'recovery' },
]

export class CasinoScene {
  readonly menuOptions: CasinoMenuOption[] = ['slot', 'blackjack', 'roulette', 'poker', 'exchange', 'prize', 'exit']
  readonly prizes = PRIZES
  private system: CasinoSystem
  private state: CasinoSceneState

  constructor(initialGold: number, initialCoins = 0, system = new CasinoSystem()) {
    this.system = system
    this.state = { gold: initialGold, casinoCoins: initialCoins, inventory: [], selectedMenu: 'slot', blackjack: null }
  }

  getState(): CasinoSceneState {
    return { ...this.state, inventory: [...this.state.inventory] }
  }

  selectMenu(option: CasinoMenuOption): void {
    if (!this.menuOptions.includes(option)) throw new Error(`Unknown casino menu: ${option}`)
    this.state.selectedMenu = option
  }

  exchangeGoldForCoins(gold: number): number {
    if (gold <= 0 || gold > this.state.gold) return 0
    const coins = Math.floor(gold / GOLD_TO_COIN_RATE)
    if (coins <= 0) return 0
    this.state.gold -= coins * GOLD_TO_COIN_RATE
    this.state.casinoCoins += coins
    return coins
  }

  exchangeCoinsForGold(coins: number): number {
    if (coins <= 0 || coins > this.state.casinoCoins) return 0
    const gold = coins * GOLD_TO_COIN_RATE
    this.state.casinoCoins -= coins
    this.state.gold += gold
    return gold
  }

  playSlot(bet: number): SlotResult | null {
    if (!this.spendCoins(bet)) return null
    const result = this.system.spinSlot(bet)
    this.state.casinoCoins += result.payout
    return result
  }

  startBlackjack(bet: number, preparedDeck?: Card[]): BlackjackGame | null {
    if (!this.spendCoins(bet)) return null
    this.state.blackjack = this.system.startBlackjack(bet, preparedDeck)
    return this.state.blackjack
  }

  blackjackHit(): BlackjackGame | null {
    if (!this.state.blackjack) return null
    this.state.blackjack = this.system.bjHit(this.state.blackjack)
    if (this.state.blackjack.status === 'player_bust') this.finishBlackjack()
    return this.state.blackjack
  }

  blackjackStand(): BlackjackGame | null {
    if (!this.state.blackjack) return null
    this.state.blackjack = this.system.bjDealerTurn(this.system.bjStand(this.state.blackjack))
    this.finishBlackjack()
    return this.state.blackjack
  }

  playRoulette(bet: number, wager: RouletteBet, number?: number): RouletteResult | null {
    if (!this.spendCoins(bet)) return null
    const result = this.system.playRoulette(wager.type, wager.value, bet, number)
    this.state.casinoCoins += result.payout
    return result
  }

  playPoker(bet: number, preparedDeck?: Card[]): PokerResult | null {
    if (!this.spendCoins(bet)) return null
    const result = this.system.evaluatePokerHand(this.system.dealPokerHand(preparedDeck), bet)
    this.state.casinoCoins += result.payout
    return result
  }

  exchangePrize(prizeId: PrizeId): Prize | null {
    const prize = this.prizes.find((entry) => entry.id === prizeId)
    if (!prize || !this.spendCoins(prize.cost)) return null
    this.state.inventory.push(prize.id)
    return prize
  }

  private finishBlackjack(): void {
    if (!this.state.blackjack) return
    this.state.casinoCoins += this.system.bjResult(this.state.blackjack).payout
  }

  private spendCoins(amount: number): boolean {
    if (amount <= 0 || this.state.casinoCoins < amount) return false
    this.state.casinoCoins -= amount
    return true
  }
}
