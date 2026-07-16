import { describe, expect, it } from 'vitest'
import { InputManager } from '@/core/InputManager'

describe('InputManager', () => {
  it('tracks just pressed, held, and released states', () => {
    const input = new InputManager()

    input.press('Enter')
    expect(input.justPressed('Enter')).toBe(true)
    expect(input.isPressed('Enter')).toBe(true)

    input.endFrame()
    expect(input.justPressed('Enter')).toBe(false)
    expect(input.isPressed('Enter')).toBe(true)

    input.release('Enter')
    expect(input.justReleased('Enter')).toBe(true)
    input.endFrame()
    expect(input.isPressed('Enter')).toBe(false)
  })

  it('ignores repeated press events while a key is held', () => {
    const input = new InputManager()

    input.press('ArrowRight')
    input.endFrame()
    input.press('ArrowRight')

    expect(input.justPressed('ArrowRight')).toBe(false)
    expect(input.isPressed('ArrowRight')).toBe(true)
  })
})
