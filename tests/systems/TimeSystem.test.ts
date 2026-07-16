import { describe, it, expect } from 'vitest'
import { TimeSystem } from '@/systems/TimeSystem'

describe('TimeSystem', () => {
  it('calculates morning/noon/evening/night from steps', () => {
    const sys = new TimeSystem()
    expect([0, 1, 2, 3].map(step => sys.getTimeSlot(step))).toEqual(['morning', 'noon', 'evening', 'night'])
  })

  it('calculates day, weekday, and season', () => {
    const sys = new TimeSystem()
    expect(sys.getDay(4)).toBe(2)
    expect(sys.getWeekday(1)).toBe('mon')
    expect(sys.getWeekday(7)).toBe('sun')
    expect(sys.getSeason(1)).toBe('spring')
    expect(sys.getSeason(31)).toBe('summer')
    expect(sys.getSeason(91)).toBe('winter')
  })

  it('advances time without going below zero', () => {
    const sys = new TimeSystem()
    expect(sys.advance(3, 2)).toBe(5)
    expect(sys.advance(1, -5)).toBe(0)
  })
})
