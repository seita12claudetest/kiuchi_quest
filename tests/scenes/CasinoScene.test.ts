import { describe, expect, it } from 'vitest'
import { CasinoScene } from '@/scenes/CasinoScene'
import type { Card } from '@/systems/CasinoSystem'

const royalFlushDeck: Card[] = [
  { suit: 'H', rank: 'A' },
  { suit: 'H', rank: 'K' },
  { suit: 'H', rank: 'Q' },
  { suit: 'H', rank: 'J' },
  { suit: 'H', rank: '10' },
]

describe('CasinoScene', () => {
  it('should expose casino menu options', () => {
    const scene = new CasinoScene(1000)
    expect(scene.menuOptions).toEqual(['slot', 'blackjack', 'roulette', 'poker', 'exchange', 'prize', 'exit'])
    scene.selectMenu('roulette')
    expect(scene.getState().selectedMenu).toBe('roulette')
  })

  it('should exchange gold and casino coins', () => {
    const scene = new CasinoScene(1000)
    expect(scene.exchangeGoldForCoins(250)).toBe(25)
    expect(scene.getState()).toMatchObject({ gold: 750, casinoCoins: 25 })
    expect(scene.exchangeCoinsForGold(5)).toBe(50)
    expect(scene.getState()).toMatchObject({ gold: 800, casinoCoins: 20 })
  })

  it('should play roulette with supported bet types', () => {
    const scene = new CasinoScene(0, 100)
    expect(scene.playRoulette(10, { type: 'single', value: 7 }, 7)?.payout).toBe(350)
    expect(scene.playRoulette(10, { type: 'color', value: 'black' }, 2)?.won).toBe(true)
    expect(scene.playRoulette(10, { type: 'dozen', value: 3 }, 30)?.payout).toBe(20)
    expect(scene.playRoulette(10, { type: 'half', value: 'low' }, 12)?.won).toBe(true)
  })

  it('should run blackjack through hit and stand flows', () => {
    const scene = new CasinoScene(0, 500)
    scene.startBlackjack(100, [
      { suit: 'S', rank: 'K' },
      { suit: 'H', rank: '7' },
      { suit: 'D', rank: '9' },
      { suit: 'C', rank: 'K' },
      { suit: 'S', rank: '8' },
    ])
    expect(scene.blackjackHit()?.status).toBe('player_bust')
    expect(scene.getState().casinoCoins).toBe(400)

    scene.startBlackjack(100, [
      { suit: 'S', rank: '10' },
      { suit: 'H', rank: '7' },
      { suit: 'D', rank: '6' },
      { suit: 'C', rank: 'K' },
      { suit: 'S', rank: '8' },
    ])
    expect(scene.blackjackStand()?.status).toBe('player_win')
    expect(scene.getState().casinoCoins).toBe(500)
  })

  it('should play poker and exchange prizes', () => {
    const scene = new CasinoScene(0, 2000)
    expect(scene.playPoker(10, royalFlushDeck)?.rank).toBe('royal_flush')
    expect(scene.exchangePrize('rare_sword')?.kind).toBe('equipment')
    expect(scene.exchangePrize('mega_potion')?.kind).toBe('recovery')
    expect(scene.getState().inventory).toEqual(['rare_sword', 'mega_potion'])
  })
})
