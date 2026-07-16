import { describe, expect, it, vi } from 'vitest'
import type { GameState, Scene } from '@/types'
import { createInitialGameState } from '@/core/createInitialGameState'
import { GameEngine } from '@/core/GameEngine'

function makeCanvas(): HTMLCanvasElement {
  return {
    width: 320,
    height: 180,
    getContext: vi.fn(() => ({ canvas: { width: 320, height: 180 } })),
  } as unknown as HTMLCanvasElement
}

function makeScene(label: string, calls: string[]): Scene {
  return {
    enter: (_state: GameState) => calls.push(`${label}:enter`),
    exit: () => calls.push(`${label}:exit`),
    update: () => calls.push(`${label}:update`),
    render: () => calls.push(`${label}:render`),
    handleInput: (key: string) => calls.push(`${label}:input:${key}`),
  }
}

describe('GameEngine', () => {
  it('pushes, replaces, and pops scenes in order', () => {
    const calls: string[] = []
    const engine = new GameEngine({ canvas: makeCanvas(), initialState: createInitialGameState() })
    const title = makeScene('title', calls)
    const map = makeScene('map', calls)

    engine.pushScene(title)
    engine.replaceScene(map)
    const removed = engine.popScene()

    expect(removed).toBe(map)
    expect(calls).toEqual(['title:enter', 'title:exit', 'map:enter', 'map:exit'])
  })

  it('routes update, render, and input to the active scene', () => {
    const calls: string[] = []
    const engine = new GameEngine({ canvas: makeCanvas(), initialState: createInitialGameState() })
    engine.pushScene(makeScene('title', calls))

    engine.tick(17)
    engine.handleInput('Enter')

    expect(calls).toContain('title:update')
    expect(calls).toContain('title:render')
    expect(calls).toContain('title:input:Enter')
  })
})
