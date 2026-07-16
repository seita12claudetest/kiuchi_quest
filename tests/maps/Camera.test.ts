import { describe, expect, it } from 'vitest'
import { Camera } from '@/maps/Camera'

describe('Camera', () => {
  it('follows the player and clamps to map bounds', () => {
    const camera = new Camera(80, 80, 40)
    camera.follow(9, 9, 10, 10)
    expect(camera.x).toBe(320)
    expect(camera.y).toBe(320)
  })

  it('clamps small maps to origin', () => {
    const camera = new Camera(400, 400, 40)
    camera.follow(5, 5, 5, 5)
    expect(camera.x).toBe(0)
    expect(camera.y).toBe(0)
  })

  it('converts between world and screen coordinates', () => {
    const camera = new Camera(80, 80, 40)
    camera.x = 40
    camera.y = 80
    expect(camera.worldToScreen(2, 3)).toEqual({ x: 40, y: 40 })
    expect(camera.screenToWorld(40, 40)).toEqual({ x: 2, y: 3 })
  })
})
