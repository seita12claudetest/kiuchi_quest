import { describe, it, expect } from 'vitest'
import { CasinoSystem } from '@/systems/CasinoSystem'

describe('CasinoSystem', () => {
  describe('Slot', () => {
    it('should return 3 reels', () => {
      const cs = new CasinoSystem()
      const result = cs.spinSlot(10)
      expect(result.reels).toHaveLength(3)
    })

    it('should pay 0 on no match', () => {
      const cs = new CasinoSystem()
      // run many spins to ensure at least one loss
      let hadLoss = false
      for (let i = 0; i < 100; i++) {
        const r = cs.spinSlot(10)
        if (r.payout === 0) { hadLoss = true; break }
      }
      expect(hadLoss).toBe(true)
    })

    it('should have positive expected value less than 1 (house edge)', () => {
      const cs = new CasinoSystem()
      let total = 0
      const runs = 10000
      for (let i = 0; i < runs; i++) total += cs.spinSlot(100).payout
      const ev = total / (runs * 100)
      expect(ev).toBeLessThan(1)
      expect(ev).toBeGreaterThan(0.3)
    })
  })

  describe('Blackjack', () => {
    it('should deal initial hand of 2 cards each', () => {
      const cs = new CasinoSystem()
      const game = cs.startBlackjack(100)
      expect(game.playerHand).toHaveLength(2)
      expect(game.dealerHand).toHaveLength(2)
    })

    it('should calculate hand value correctly', () => {
      const cs = new CasinoSystem()
      expect(cs.bjHandValue([{ suit: 'S', rank: 'A' }, { suit: 'H', rank: 'K' }])).toBe(21)
      expect(cs.bjHandValue([{ suit: 'S', rank: 'A' }, { suit: 'H', rank: 'A' }, { suit: 'D', rank: '9' }])).toBe(21)
    })

    it('should detect bust over 21', () => {
      const cs = new CasinoSystem()
      expect(cs.bjHandValue([{ suit: 'S', rank: 'K' }, { suit: 'H', rank: 'Q' }, { suit: 'D', rank: '5' }])).toBe(25)
    })
  })

  describe('Roulette', () => {
    it('should return number between 0 and 36', () => {
      const cs = new CasinoSystem()
      for (let i = 0; i < 100; i++) {
        const n = cs.spinRoulette()
        expect(n).toBeGreaterThanOrEqual(0)
        expect(n).toBeLessThanOrEqual(36)
      }
    })

    it('should pay 35:1 on single number', () => {
      const cs = new CasinoSystem()
      const payout = cs.calcRoulettePayout('single', 100, true)
      expect(payout).toBe(3500)
    })

    it('should pay 1:1 on red/black', () => {
      const cs = new CasinoSystem()
      const payout = cs.calcRoulettePayout('color', 100, true)
      expect(payout).toBe(100)
    })
  })
})
