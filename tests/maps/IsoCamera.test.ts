import { describe, expect, it } from 'vitest'
import { IsoCamera } from '@/maps/IsoCamera'

describe('IsoCamera', () => {
  it('projects tile coordinates onto a 2:1 isometric diamond grid', () => {
    const camera = new IsoCamera(800, 600, 64, 32)
    expect(camera.project(0, 0)).toEqual({ x: 0, y: 0 })
    expect(camera.project(1, 0)).toEqual({ x: 32, y: 16 })
    expect(camera.project(0, 1)).toEqual({ x: -32, y: 16 })
    expect(camera.project(1, 1)).toEqual({ x: 0, y: 32 })
  })

  it('worldToScreen subtracts camera scroll from the projection', () => {
    const camera = new IsoCamera(800, 600, 64, 32)
    camera.x = 10
    camera.y = 5
    const projected = camera.project(2, 3)
    expect(camera.worldToScreen(2, 3)).toEqual({ x: projected.x - 10, y: projected.y - 5 })
  })

  it('clamps the camera within the projected map bounds', () => {
    const camera = new IsoCamera(800, 600, 64, 32)
    camera.follow(0, 0, 4, 4)
    const { minX, minY } = camera.bounds(4, 4)
    expect(camera.x).toBeCloseTo(minX)
    expect(camera.y).toBeCloseTo(minY)
  })
})
