export type KeyState = 'up' | 'pressed' | 'held' | 'released'

export class InputManager {
  private states = new Map<string, KeyState>()
  private readonly target?: Pick<Window, 'addEventListener' | 'removeEventListener'>
  private readonly onKeyDown = (event: KeyboardEvent): void => this.press(event.key)
  private readonly onKeyUp = (event: KeyboardEvent): void => this.release(event.key)

  constructor(target?: Pick<Window, 'addEventListener' | 'removeEventListener'>) {
    this.target = target
  }

  attach(): void {
    this.target?.addEventListener('keydown', this.onKeyDown as EventListener)
    this.target?.addEventListener('keyup', this.onKeyUp as EventListener)
  }

  detach(): void {
    this.target?.removeEventListener('keydown', this.onKeyDown as EventListener)
    this.target?.removeEventListener('keyup', this.onKeyUp as EventListener)
  }

  press(key: string): void {
    const current = this.states.get(key) ?? 'up'
    if (current === 'up' || current === 'released') this.states.set(key, 'pressed')
  }

  release(key: string): void {
    const current = this.states.get(key) ?? 'up'
    if (current === 'pressed' || current === 'held') this.states.set(key, 'released')
  }

  isPressed(key: string): boolean {
    const state = this.states.get(key)
    return state === 'pressed' || state === 'held'
  }

  justPressed(key: string): boolean {
    return this.states.get(key) === 'pressed'
  }

  justReleased(key: string): boolean {
    return this.states.get(key) === 'released'
  }

  endFrame(): void {
    for (const [key, state] of this.states) {
      if (state === 'pressed') this.states.set(key, 'held')
      if (state === 'released') this.states.delete(key)
    }
  }

  clear(): void {
    this.states.clear()
  }
}
