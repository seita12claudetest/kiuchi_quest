import type { HealthStats } from '@/types'

const THRESHOLDS = {
  blood: { danger: 160, high: 140, low: 80, min: 80 },
  uric: { danger: 9.0, high: 7.0, low: 3.0, min: 3.0 },
  chol: { danger: 280, high: 220, low: 100, min: 100 },
  liver: { danger: 100, high: 60, low: 10, min: 10 },
  sugar: { danger: 180, high: 126, low: 60, min: 60 },
}

export class HealthSystem {
  isDangerous(h: HealthStats): boolean {
    return h.blood >= THRESHOLDS.blood.danger
      || h.uric >= THRESHOLDS.uric.danger
      || h.chol >= THRESHOLDS.chol.danger
      || h.liver >= THRESHOLDS.liver.danger
      || h.sugar >= THRESHOLDS.sugar.danger
  }

  applyGym(h: HealthStats): HealthStats {
    return this.clamp({
      ...h,
      blood: h.blood - 6,
      sugar: h.sugar - 4,
      liver: h.liver - 2,
    })
  }

  applyHospital(h: HealthStats): HealthStats {
    return this.clamp({
      blood: h.blood - 12,
      uric: h.uric - 0.3,
      chol: h.chol - 10,
      liver: h.liver - 5,
      sugar: h.sugar - 8,
    })
  }

  applyFoodEffect(h: HealthStats, effect: HealthStats): HealthStats {
    return this.clamp({
      blood: h.blood + effect.blood,
      uric: h.uric + effect.uric,
      chol: h.chol + effect.chol,
      liver: h.liver + effect.liver,
      sugar: h.sugar + effect.sugar,
    })
  }

  getGrade(h: HealthStats): 'A' | 'B' | 'C' | 'D' | 'E' {
    let score = 0
    const check = (val: number, key: keyof typeof THRESHOLDS) => {
      if (val < THRESHOLDS[key].high) score += 2
      else if (val < THRESHOLDS[key].danger) score -= 1
      else score -= 3
    }
    check(h.blood, 'blood')
    check(h.uric, 'uric')
    check(h.chol, 'chol')
    check(h.liver, 'liver')
    check(h.sugar, 'sugar')
    if (score >= 8) return 'A'
    if (score >= 4) return 'B'
    if (score >= -2) return 'C'
    if (score >= -8) return 'D'
    return 'E'
  }

  getConditions(h: HealthStats): string[] {
    const conditions: string[] = []
    if (h.blood >= THRESHOLDS.blood.danger) conditions.push('高血圧')
    if (h.uric >= THRESHOLDS.uric.danger) conditions.push('高尿酸')
    if (h.chol >= THRESHOLDS.chol.danger) conditions.push('高コレステロール')
    if (h.liver >= THRESHOLDS.liver.danger) conditions.push('肝機能障害')
    if (h.sugar >= THRESHOLDS.sugar.danger) conditions.push('高血糖')
    return conditions
  }

  private clamp(h: HealthStats): HealthStats {
    return {
      blood: Math.max(THRESHOLDS.blood.min, h.blood),
      uric: Math.max(THRESHOLDS.uric.min, h.uric),
      chol: Math.max(THRESHOLDS.chol.min, h.chol),
      liver: Math.max(THRESHOLDS.liver.min, h.liver),
      sugar: Math.max(THRESHOLDS.sugar.min, h.sugar),
    }
  }
}
