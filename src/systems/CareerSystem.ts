import type { CareerRank, CareerState } from '@/types'

export const CAREER_LADDER: { rank: CareerRank; name: string; minPerformance: number; minTrust: number; minExpertise: number; minMonths: number }[] = [
  { rank: 'new_hire', name: '新卒社員', minPerformance: 0, minTrust: 0, minExpertise: 0, minMonths: 0 },
  { rank: 'staff', name: '平社員', minPerformance: 12, minTrust: 10, minExpertise: 6, minMonths: 1 },
  { rank: 'senior', name: '主任', minPerformance: 32, minTrust: 24, minExpertise: 20, minMonths: 3 },
  { rank: 'chief', name: '係長', minPerformance: 58, minTrust: 42, minExpertise: 38, minMonths: 4 },
  { rank: 'assistant_manager', name: '課長代理', minPerformance: 88, minTrust: 64, minExpertise: 55, minMonths: 5 },
  { rank: 'manager', name: '課長', minPerformance: 122, minTrust: 88, minExpertise: 76, minMonths: 6 },
  { rank: 'deputy_manager', name: '副部長', minPerformance: 165, minTrust: 118, minExpertise: 102, minMonths: 8 },
]

export type WorkResult = Partial<Pick<CareerState, 'performance' | 'trust' | 'expertise' | 'politics' | 'stress'>>

export class CareerSystem {
  work(career: CareerState, result: WorkResult): CareerState {
    const next = { ...career }
    for (const key of ['performance', 'trust', 'expertise', 'politics', 'stress'] as const) {
      next[key] = Math.max(0, career[key] + (result[key] ?? 0))
    }
    return this.promote(next)
  }

  advanceMonth(career: CareerState): CareerState {
    const nextMonth = career.calendarMonth === 12 ? 1 : career.calendarMonth + 1
    const nextYear = career.calendarMonth === 12 ? career.year + 1 : career.year
    return this.promote({
      ...career,
      calendarMonth: nextMonth,
      year: nextYear,
      age: career.age + (career.calendarMonth === 12 ? 1 : 0),
      monthsAtRank: career.monthsAtRank + 1,
    })
  }

  private promote(career: CareerState): CareerState {
    const current = CAREER_LADDER.findIndex(entry => entry.rank === career.rank)
    const target = CAREER_LADDER[current + 1]
    if (!target || career.performance < target.minPerformance || career.trust < target.minTrust || career.expertise < target.minExpertise || career.monthsAtRank < target.minMonths) return career
    return { ...career, rank: target.rank, rankName: target.name, monthsAtRank: 0 }
  }
}
