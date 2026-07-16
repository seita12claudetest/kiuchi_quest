export type InputKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | 'Enter' | 'Escape'

export interface InputSnapshot {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
  enter: boolean
  escape: boolean
}

const SUPPORTED_KEYS = new Set<InputKey>([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Enter',
  'Escape'
])

export class InputManager {
  private pressedKeys = new Set<InputKey>()
  private readonly target: Pick<Window, 'addEventListener' | 'removeEventListener'>
  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (!this.isSupportedKey(event.key)) return
    this.pressedKeys.add(event.key)
    event.preventDefault()
  }

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    if (!this.isSupportedKey(event.key)) return
    this.pressedKeys.delete(event.key)
    event.preventDefault()
  }

  constructor(target: Pick<Window, 'addEventListener' | 'removeEventListener'> = window) {
    this.target = target
  }

  attach(): void {
    this.target.addEventListener('keydown', this.onKeyDown as EventListener)
    this.target.addEventListener('keyup', this.onKeyUp as EventListener)
  }

  detach(): void {
    this.target.removeEventListener('keydown', this.onKeyDown as EventListener)
    this.target.removeEventListener('keyup', this.onKeyUp as EventListener)
    this.pressedKeys.clear()
  }

  isPressed(key: InputKey): boolean {
    return this.pressedKeys.has(key)
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

  private isSupportedKey(key: string): key is InputKey {
    return SUPPORTED_KEYS.has(key as InputKey)
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
