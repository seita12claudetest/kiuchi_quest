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
  }
}
