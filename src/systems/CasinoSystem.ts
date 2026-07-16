export interface Card {
  suit: 'S' | 'H' | 'D' | 'C'
  rank: string
}

export interface SlotResult {
  reels: string[]
  payout: number
}

export interface BlackjackGame {
  playerHand: Card[]
  dealerHand: Card[]
  bet: number
  deck: Card[]
}

const SLOT_SYMBOLS = ['🍒', '🍋', '🔔', '⭐', '7️⃣', '💎']
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const SUITS: Card['suit'][] = ['S', 'H', 'D', 'C']

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

  startBlackjack(bet: number): BlackjackGame {
    const deck = this.createDeck()
    this.shuffle(deck)
    return {
      playerHand: [deck.pop()!, deck.pop()!],
      dealerHand: [deck.pop()!, deck.pop()!],
      bet,
      deck,
    }
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

  calcRoulettePayout(betType: 'single' | 'color' | 'dozen' | 'half', bet: number, won: boolean): number {
    if (!won) return 0
    const multipliers = { single: 35, color: 1, dozen: 2, half: 1 }
    return bet * multipliers[betType]
  }

  private createDeck(): Card[] {
    const deck: Card[] = []
    for (const suit of SUITS) for (const rank of RANKS) deck.push({ suit, rank })
    return deck
  }

  private shuffle(arr: any[]): void {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
  }
}
