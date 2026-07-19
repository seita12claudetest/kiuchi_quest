import { describe, expect, it, vi } from 'vitest'
import { InputManager } from '@/core/InputManager'

const keyboardEvent = (type: string, key: string): KeyboardEvent => {
  const event = new Event(type, { cancelable: true }) as KeyboardEvent
  Object.defineProperty(event, 'key', { value: key })
  return event
}

describe('InputManager', () => {
  it('tracks supported key presses and releases', () => {
    const target = new EventTarget()
    const manager = new InputManager(target)
    manager.attach()

    target.dispatchEvent(keyboardEvent('keydown', 'ArrowUp'))
    target.dispatchEvent(keyboardEvent('keydown', 'Enter'))

    expect(manager.isPressed('ArrowUp')).toBe(true)
    expect(manager.snapshot.enter).toBe(true)

    target.dispatchEvent(keyboardEvent('keyup', 'ArrowUp'))

    expect(manager.isPressed('ArrowUp')).toBe(false)
    expect(manager.snapshot.enter).toBe(true)

    manager.detach()
  })

  it('ignores unsupported keys', () => {
    const target = new EventTarget()
    const manager = new InputManager(target)
    manager.attach()

    target.dispatchEvent(keyboardEvent('keydown', 'a'))

    expect(manager.snapshot).toEqual({
      up: false,
      down: false,
      left: false,
      right: false,
      enter: false,
      escape: false
    })

    manager.detach()
  })

  it('registers and removes keyboard listeners', () => {
    const target = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }
    const manager = new InputManager(target)

    manager.attach()
    manager.detach()

    expect(target.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
    expect(target.addEventListener).toHaveBeenCalledWith('keyup', expect.any(Function))
    expect(target.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
    expect(target.removeEventListener).toHaveBeenCalledWith('keyup', expect.any(Function))
  })
})
