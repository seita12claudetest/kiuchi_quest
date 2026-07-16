import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GameEngine } from '@/core/GameEngine'
import type { GameState, Scene } from '@/types'

const createState = (): GameState => ({
  player: {
    x: 0,
    y: 0,
    level: 1,
    xp: 0,
    nextXp: 10,
    hp: 30,
    maxHp: 30,
    power: 5,
    def: 3,
    gold: 0,
    health: { blood: 120, uric: 5, chol: 180, liver: 30, sugar: 90 },
    belly: 100,
    special: 0,
    equipment: { weapon: null, armor: null, accessory1: null, accessory2: null },
    skills: [],
    sp: 0
  },
  currentMap: 'title',
  day: 1,
  timeSlot: 'morning',
  flags: {},
  mode: 'title'
})

const createScene = (): Scene => ({
  enter: vi.fn(),
  exit: vi.fn(),
  update: vi.fn(),
  render: vi.fn(),
  handleInput: vi.fn()
})

describe('GameEngine', () => {
  let rafCallback: FrameRequestCallback

  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => {
      rafCallback = callback
      return 1
    }))
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.spyOn(performance, 'now').mockReturnValue(1000)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('calls update and render from requestAnimationFrame loop', () => {
    const scene = createScene()
    const context = { canvas: { width: 640, height: 360 } } as CanvasRenderingContext2D
    const canvas = { getContext: vi.fn(() => context) } as unknown as HTMLCanvasElement
    const input = { attach: vi.fn(), detach: vi.fn(), snapshot: { up: false, down: false, left: false, right: false, enter: false, escape: false } }
    const state = createState()
    const engine = new GameEngine(canvas, scene, state, input)

    engine.start()
    rafCallback(1016)

    expect(scene.enter).toHaveBeenCalledWith(state)
    expect(scene.update).toHaveBeenCalledWith(0.016, state)
    expect(scene.render).toHaveBeenCalledWith(context, state)
  })

  it('dispatches pressed input keys before updating', () => {
    const scene = createScene()
    const canvas = { getContext: vi.fn(() => ({ canvas: {} })) } as unknown as HTMLCanvasElement
    const input = { attach: vi.fn(), detach: vi.fn(), snapshot: { up: true, down: false, left: false, right: false, enter: true, escape: false } }
    const state = createState()
    const engine = new GameEngine(canvas, scene, state, input)

    engine.start()
    rafCallback(1032)

    expect(scene.handleInput).toHaveBeenCalledWith('ArrowUp', state)
    expect(scene.handleInput).toHaveBeenCalledWith('Enter', state)
  })

  it('exits the current scene and enters the next scene on changeScene', () => {
    const scene = createScene()
    const nextScene = createScene()
    const canvas = { getContext: vi.fn(() => ({ canvas: {} })) } as unknown as HTMLCanvasElement
    const input = { attach: vi.fn(), detach: vi.fn(), snapshot: { up: false, down: false, left: false, right: false, enter: false, escape: false } }
    const state = createState()
    const engine = new GameEngine(canvas, scene, state, input)

    engine.changeScene(nextScene)

    expect(scene.exit).toHaveBeenCalled()
    expect(nextScene.enter).toHaveBeenCalledWith(state)
    expect(engine.currentScene).toBe(nextScene)
  })
})
