export interface Card {
  suit: 'S' | 'H' | 'D' | 'C'
  rank: string
}

export interface SlotResult {
  reels: string[]
  payout: number
}

export type BlackjackStatus = 'playing' | 'player_bust' | 'dealer_turn' | 'player_win' | 'dealer_win' | 'push'

export interface BlackjackGame {
  playerHand: Card[]
  dealerHand: Card[]
  bet: number
  deck: Card[]
  status: BlackjackStatus
}

export type RouletteBet =
  | { type: 'single'; value: number }
  | { type: 'color'; value: 'red' | 'black' }
  | { type: 'dozen'; value: 1 | 2 | 3 }
  | { type: 'half'; value: 'low' | 'high' }

export interface RouletteResult {
  number: number
  won: boolean
  payout: number
}

export type PokerHandRank =
  | 'royal_flush'
  | 'straight_flush'
  | 'four_kind'
  | 'full_house'
  | 'flush'
  | 'straight'
  | 'three_kind'
  | 'two_pair'
  | 'one_pair'
  | 'high_card'

export interface PokerResult {
  rank: PokerHandRank
  payout: number
}

const SLOT_SYMBOLS = ['🍒', '🍋', '🔔', '⭐', '7️⃣', '💎']
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const SUITS: Card['suit'][] = ['S', 'H', 'D', 'C']
const RED_NUMBERS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36])

export class CasinoSystem {
  spinSlot(bet: number): SlotResult {
    const reels = [
      SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
      SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
      SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
    ]
    let multiplier = 0
    if (reels[0] === reels[1] && reels[1] === reels[2]) {
      const idx = SLOT_SYMBOLS.indexOf(reels[0])
      multiplier = [3, 4, 5, 8, 15, 30][idx]
    } else if (reels[0] === reels[1] || reels[1] === reels[2]) {
      multiplier = 1.5
    }
    return { reels, payout: Math.floor(bet * multiplier) }
  }

  startBlackjack(bet: number, preparedDeck?: Card[]): BlackjackGame {
    const deck = preparedDeck ? [...preparedDeck] : this.createShuffledDeck()
    const game: BlackjackGame = {
      playerHand: [deck.pop()!, deck.pop()!],
      dealerHand: [deck.pop()!, deck.pop()!],
      bet,
      deck,
      status: 'playing',
    }
    if (this.bjHandValue(game.playerHand) === 21 || this.bjHandValue(game.dealerHand) === 21) {
      game.status = this.resolveBlackjack(game)
    }
    return game
  }

  bjHit(game: BlackjackGame): BlackjackGame {
    if (game.status !== 'playing') return game
    const deck = [...game.deck]
    const next = { ...game, playerHand: [...game.playerHand, deck.pop()!], deck }
    next.status = this.bjHandValue(next.playerHand) > 21 ? 'player_bust' : 'playing'
    return next
  }

  bjStand(game: BlackjackGame): BlackjackGame {
    if (game.status !== 'playing') return game
    return { ...game, status: 'dealer_turn' }
  }

  bjDealerTurn(game: BlackjackGame): BlackjackGame {
    if (game.status !== 'dealer_turn') return game
    const dealerHand = [...game.dealerHand]
    const deck = [...game.deck]
    while (this.bjHandValue(dealerHand) < 17) dealerHand.push(deck.pop()!)
    const next = { ...game, dealerHand, deck }
    return { ...next, status: this.resolveBlackjack(next) }
  }

  bjResult(game: BlackjackGame): { status: BlackjackStatus; payout: number } {
    const status = game.status === 'dealer_turn' || game.status === 'playing' ? this.resolveBlackjack(game) : game.status
    if (status === 'player_win') return { status, payout: game.bet * 2 }
    if (status === 'push') return { status, payout: game.bet }
    return { status, payout: 0 }
  }

  bjHandValue(hand: Card[]): number {
    let value = 0
    let aces = 0
    for (const card of hand) {
      if (card.rank === 'A') { aces++; value += 11 }
      else if (['K', 'Q', 'J'].includes(card.rank)) value += 10
      else value += parseInt(card.rank)
    }
    while (value > 21 && aces > 0) { value -= 10; aces-- }
    return value
  }

  spinRoulette(): number {
    return Math.floor(Math.random() * 37)
  }

  playRoulette(betType: RouletteBet['type'], betValue: RouletteBet['value'], bet: number, number = this.spinRoulette()): RouletteResult {
    const wager = { type: betType, value: betValue } as RouletteBet
    const won = this.isRouletteWinner(wager, number)
    return { number, won, payout: this.calcRoulettePayout(wager.type, bet, won) }
  }

  isRouletteWinner(bet: RouletteBet, number: number): boolean {
    if (number === 0) return bet.type === 'single' && bet.value === 0
    if (bet.type === 'single') return bet.value === number
    if (bet.type === 'color') return (bet.value === 'red') === RED_NUMBERS.has(number)
    if (bet.type === 'dozen') return Math.ceil(number / 12) === bet.value
    return bet.value === 'low' ? number >= 1 && number <= 18 : number >= 19 && number <= 36
  }

  calcRoulettePayout(betType: 'single' | 'color' | 'dozen' | 'half', bet: number, won: boolean): number {
    if (!won) return 0
    const multipliers = { single: 35, color: 1, dozen: 2, half: 1 }
    return bet * multipliers[betType]
  }

  dealPokerHand(preparedDeck?: Card[]): Card[] {
    const deck = preparedDeck ? [...preparedDeck] : this.createShuffledDeck()
    return [deck.pop()!, deck.pop()!, deck.pop()!, deck.pop()!, deck.pop()!]
  }

  evaluatePokerHand(hand: Card[], bet: number): PokerResult {
    const values = hand.map((card) => this.rankValue(card.rank)).sort((a, b) => a - b)
    const counts = new Map<number, number>()
    for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1)
    const groups = [...counts.values()].sort((a, b) => b - a)
    const flush = hand.every((card) => card.suit === hand[0].suit)
    const straight = this.isStraight(values)
    const highAce = values[values.length - 1] === 14

    let rank: PokerHandRank = 'high_card'
    if (flush && straight && highAce && values[0] === 10) rank = 'royal_flush'
    else if (flush && straight) rank = 'straight_flush'
    else if (groups[0] === 4) rank = 'four_kind'
    else if (groups[0] === 3 && groups[1] === 2) rank = 'full_house'
    else if (flush) rank = 'flush'
    else if (straight) rank = 'straight'
    else if (groups[0] === 3) rank = 'three_kind'
    else if (groups[0] === 2 && groups[1] === 2) rank = 'two_pair'
    else if (groups[0] === 2) rank = 'one_pair'

    const multipliers: Record<PokerHandRank, number> = {
      royal_flush: 250,
      straight_flush: 50,
      four_kind: 25,
      full_house: 9,
      flush: 6,
      straight: 4,
      three_kind: 3,
      two_pair: 2,
      one_pair: 1,
      high_card: 0,
    }
    return { rank, payout: bet * multipliers[rank] }
  }

  private resolveBlackjack(game: BlackjackGame): BlackjackStatus {
    const player = this.bjHandValue(game.playerHand)
    const dealer = this.bjHandValue(game.dealerHand)
    if (player > 21) return 'player_bust'
    if (dealer > 21) return 'player_win'
    if (player > dealer) return 'player_win'
    if (dealer > player) return 'dealer_win'
    return 'push'
  }

  private createShuffledDeck(): Card[] {
    const deck = this.createDeck()
    this.shuffle(deck)
    return deck
  }

  private rankValue(rank: string): number {
    if (rank === 'A') return 14
    if (rank === 'K') return 13
    if (rank === 'Q') return 12
    if (rank === 'J') return 11
    return parseInt(rank)
  }

  private isStraight(values: number[]): boolean {
    if (values.join(',') === '2,3,4,5,14') return true
    return values.every((value, index) => index === 0 || value === values[index - 1] + 1)
  }

  private createDeck(): Card[] {
    const deck: Card[] = []
    for (const suit of SUITS) for (const rank of RANKS) deck.push({ suit, rank })
    return deck
  }

  private shuffle(arr: unknown[]): void {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
  }
}
