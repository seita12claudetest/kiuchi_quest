import { describe, it, expect, vi } from 'vitest'
import { EventBus } from '@/core/EventBus'

describe('EventBus', () => {
  it('should emit and receive events', () => {
    const bus = new EventBus()
    const handler = vi.fn()
    bus.on('test', handler)
    bus.emit('test', { value: 42 })
    expect(handler).toHaveBeenCalledWith({ value: 42 })
  })

  it('should support multiple listeners', () => {
    const bus = new EventBus()
    const h1 = vi.fn()
    const h2 = vi.fn()
    bus.on('e', h1)
    bus.on('e', h2)
    bus.emit('e', 'data')
    expect(h1).toHaveBeenCalledWith('data')
    expect(h2).toHaveBeenCalledWith('data')
  })

  it('should unsubscribe with off()', () => {
    const bus = new EventBus()
    const handler = vi.fn()
    bus.on('x', handler)
    bus.off('x', handler)
    bus.emit('x', null)
    expect(handler).not.toHaveBeenCalled()
  })

  it('should support once()', () => {
    const bus = new EventBus()
    const handler = vi.fn()
    bus.once('y', handler)
    bus.emit('y', 1)
    bus.emit('y', 2)
    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(1)
  })

  it('should clear all listeners with clear()', () => {
    const bus = new EventBus()
    const h = vi.fn()
    bus.on('a', h)
    bus.on('b', h)
    bus.clear()
    bus.emit('a', null)
    bus.emit('b', null)
    expect(h).not.toHaveBeenCalled()
  })
})
