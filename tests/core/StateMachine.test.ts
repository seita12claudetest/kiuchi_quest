import { describe, it, expect, vi } from 'vitest'
import { StateMachine } from '@/core/StateMachine'
import type { GameMode } from '@/types'

describe('StateMachine', () => {
  it('should initialize with given state', () => {
    const sm = new StateMachine<GameMode>('map')
    expect(sm.current).toBe('map')
  })

  it('should transition to a new state', () => {
    const sm = new StateMachine<GameMode>('map')
    sm.transition('battle')
    expect(sm.current).toBe('battle')
  })

  it('should call onExit and onEnter hooks', () => {
    const onExit = vi.fn()
    const onEnter = vi.fn()
    const sm = new StateMachine<GameMode>('map', { onExit, onEnter })
    sm.transition('battle')
    expect(onExit).toHaveBeenCalledWith('map', 'battle')
    expect(onEnter).toHaveBeenCalledWith('battle', 'map')
  })

  it('should track state history', () => {
    const sm = new StateMachine<GameMode>('map')
    sm.transition('battle')
    sm.transition('event')
    expect(sm.history).toEqual(['map', 'battle', 'event'])
  })

  it('should support canTransition guard', () => {
    const sm = new StateMachine<GameMode>('map', {
      canTransition: (from, to) => !(from === 'battle' && to === 'title')
    })
    sm.transition('battle')
    const result = sm.transition('title')
    expect(result).toBe(false)
    expect(sm.current).toBe('battle')
  })

  it('should go back to previous state', () => {
    const sm = new StateMachine<GameMode>('map')
    sm.transition('menu')
    sm.back()
    expect(sm.current).toBe('map')
  })
})
