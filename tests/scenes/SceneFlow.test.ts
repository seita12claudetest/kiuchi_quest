import { describe, expect, it } from 'vitest'
import { createInitialGameState } from '@/core/createInitialGameState'
import { MapScene } from '@/scenes/MapScene'
import { TitleScene } from '@/scenes/TitleScene'

describe('scene flow', () => {
  it('title scene starts the game via callback', () => {
    const state = createInitialGameState()
    let started = false
    const scene = new TitleScene(() => { started = true })

    scene.enter(state)
    scene.handleInput('Enter', state)

    expect(state.mode).toBe('title')
    expect(started).toBe(true)
  })

  it('map scene moves the player within bounds', () => {
    const state = createInitialGameState()
    const scene = new MapScene()

    scene.enter(state)
    scene.handleInput('ArrowRight', state)
    scene.handleInput('ArrowDown', state)

    expect(state.mode).toBe('map')
    expect(state.player.x).toBe(7)
    expect(state.player.y).toBe(7)
  })
})
