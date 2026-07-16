export interface StateMachineOptions<T> {
  onEnter?: (to: T, from: T) => void
  onExit?: (from: T, to: T) => void
  canTransition?: (from: T, to: T) => boolean
}

export class StateMachine<T extends string> {
  private _current: T
  private _history: T[] = []
  private opts: StateMachineOptions<T>

  constructor(initial: T, opts: StateMachineOptions<T> = {}) {
    this._current = initial
    this._history = [initial]
    this.opts = opts
  }

  get current(): T { return this._current }
  get history(): T[] { return [...this._history] }

  transition(to: T): boolean {
    if (this.opts.canTransition && !this.opts.canTransition(this._current, to)) {
      return false
    }
    const from = this._current
    this.opts.onExit?.(from, to)
    this._current = to
    this._history.push(to)
    this.opts.onEnter?.(to, from)
    return true
  }

  back(): boolean {
    if (this._history.length < 2) return false
    this._history.pop()
    this._current = this._history[this._history.length - 1]
    return true
  }
}
