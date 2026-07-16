export type InputKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'Enter' | 'Escape'
export type KeyState = 'up' | 'pressed' | 'held' | 'released'

export interface InputSnapshot {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
  enter: boolean
  escape: boolean
}

const KEY_TO_SNAPSHOT: Record<InputKey, keyof InputSnapshot> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  Enter: 'enter',
  Escape: 'escape'
}

export class InputManager {
  private states = new Map<string, KeyState>()
  private readonly target?: Pick<Window, 'addEventListener' | 'removeEventListener'>
  private readonly onKeyDown = (event: KeyboardEvent): void => {
    this.press(event.key)
    if (event.key in KEY_TO_SNAPSHOT) event.preventDefault()
  }
  private readonly onKeyUp = (event: KeyboardEvent): void => {
    this.release(event.key)
    if (event.key in KEY_TO_SNAPSHOT) event.preventDefault()
  }

  constructor(target: Pick<Window, 'addEventListener' | 'removeEventListener'> = window) {
    this.target = target
  }

  attach(): void {
    this.target?.addEventListener('keydown', this.onKeyDown as EventListener)
    this.target?.addEventListener('keyup', this.onKeyUp as EventListener)
  }

  detach(): void {
    this.target?.removeEventListener('keydown', this.onKeyDown as EventListener)
    this.target?.removeEventListener('keyup', this.onKeyUp as EventListener)
    this.clear()
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

  get snapshot(): InputSnapshot {
    return {
      up: this.isPressed('ArrowUp'),
      down: this.isPressed('ArrowDown'),
      left: this.isPressed('ArrowLeft'),
      right: this.isPressed('ArrowRight'),
      enter: this.isPressed('Enter'),
      escape: this.isPressed('Escape')
    }
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
