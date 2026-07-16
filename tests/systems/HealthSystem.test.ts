import { describe, it, expect } from 'vitest'
import { HealthSystem } from '@/systems/HealthSystem'
import type { HealthStats } from '@/types'

function makeHealth(overrides: Partial<HealthStats> = {}): HealthStats {
  return { blood: 120, uric: 5.8, chol: 190, liver: 40, sugar: 95, ...overrides }
}

describe('HealthSystem', () => {
  it('should detect dangerous blood pressure', () => {
    const hs = new HealthSystem()
    expect(hs.isDangerous(makeHealth({ blood: 159 }))).toBe(false)
    expect(hs.isDangerous(makeHealth({ blood: 160 }))).toBe(true)
  })

  it('should detect dangerous uric acid', () => {
    const hs = new HealthSystem()
    expect(hs.isDangerous(makeHealth({ uric: 8.9 }))).toBe(false)
    expect(hs.isDangerous(makeHealth({ uric: 9.0 }))).toBe(true)
  })

  it('should apply gym effect (reduce blood, increase nothing bad)', () => {
    const hs = new HealthSystem()
    const result = hs.applyGym(makeHealth({ blood: 140 }))
    expect(result.blood).toBeLessThan(140)
    expect(result.blood).toBeGreaterThanOrEqual(90)
  })

  it('should apply hospital treatment', () => {
    const hs = new HealthSystem()
    const result = hs.applyHospital(makeHealth({ blood: 160, uric: 8, chol: 250 }))
    expect(result.blood).toBeLessThan(160)
    expect(result.uric).toBeLessThan(8)
    expect(result.chol).toBeLessThan(250)
  })

  it('should apply food effect', () => {
    const hs = new HealthSystem()
    const result = hs.applyFoodEffect(makeHealth(), { blood: 5, uric: 0.2, chol: 10, liver: 5, sugar: 8 })
    expect(result.blood).toBe(125)
    expect(result.uric).toBeCloseTo(6.0)
  })

  it('should clamp values to minimum', () => {
    const hs = new HealthSystem()
    const result = hs.applyFoodEffect(makeHealth({ blood: 85 }), { blood: -10, uric: 0, chol: 0, liver: 0, sugar: 0 })
    expect(result.blood).toBe(80) // min blood is 80
  })

  it('should calculate health grade', () => {
    const hs = new HealthSystem()
    expect(hs.getGrade(makeHealth({ blood: 110, uric: 5, chol: 180, liver: 30, sugar: 90 }))).toBe('A')
    expect(hs.getGrade(makeHealth({ blood: 150, uric: 7.5, chol: 230, liver: 65, sugar: 100 }))).toBe('C')
    expect(hs.getGrade(makeHealth({ blood: 200, uric: 10, chol: 300, liver: 150, sugar: 200 }))).toBe('E')
  })

  it('should detect specific conditions', () => {
    const hs = new HealthSystem()
    const conditions = hs.getConditions(makeHealth({ blood: 180, uric: 9.5, liver: 120 }))
    expect(conditions).toContain('高血圧')
    expect(conditions).toContain('高尿酸')
    expect(conditions).toContain('肝機能障害')
  })
})
