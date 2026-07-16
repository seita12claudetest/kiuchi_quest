import type { SaveData } from '@/types'

export function makeSaveData(overrides: Partial<SaveData> = {}): SaveData {
  return {
    version: 1,
    state: {
      player: {
        x: 0, y: 0, level: 1, xp: 0, nextXp: 10, hp: 50, maxHp: 100,
        power: 5, def: 3, gold: 0,
        health: { blood: 120, uric: 5, chol: 180, liver: 30, sugar: 90 },
        belly: 0, special: 0,
        equipment: { weapon: null, armor: null, accessory1: null, accessory2: null },
        skills: [], sp: 0,
      },
      currentMap: 'river', day: 1, timeSlot: 'morning', flags: {}, mode: 'map',
    },
    inventory: {}, quests: {}, relations: {},
    dex: { enemies: {}, items: {}, fish: {}, food: {} },
    achievements: [], titles: [], endings: [], foodLog: [], fishLog: {}, playtime: 0,
    ...overrides,
  }
}
