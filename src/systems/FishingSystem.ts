import type { FishDef, TimeSlot, Season } from '@/types'

export class FishingSystem {
  getAvailableFish(pool: FishDef[], time: TimeSlot, season: Season, location: string): FishDef[] {
    return pool.filter(f =>
      f.timeSlots.includes(time) &&
      f.seasons.includes(season) &&
      f.locations.includes(location)
    )
  }

  generateSize(fish: FishDef): number {
    const [min, max] = fish.size
    return min + Math.random() * (max - min)
  }

  attemptCatch(difficulty: number, timing: number): boolean {
    const baseRate = 1 - (difficulty - 1) / 12
    const bonus = Math.abs(timing - 0.5) < 0.15 ? 0.2 : 0
    return Math.random() < (baseRate + bonus)
  }

  calcSellPrice(fish: FishDef, size: number): number {
    const sizeBonus = size / fish.size[1]
    return Math.floor(fish.sellPrice * sizeBonus * (1 + fish.rarity * 0.3))
  }
}
