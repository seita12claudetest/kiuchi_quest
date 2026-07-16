import type { SaveData } from '@/types'

export function baseSave(overrides: Partial<SaveData> = {}): SaveData {
  const base: SaveData = {
    version: 1,
    state: {
      player: {
        x: 0, y: 0, level: 1, xp: 0, nextXp: 10, hp: 10, maxHp: 20,
        power: 1, def: 1, gold: 0,
        health: { blood: 100, uric: 5, chol: 180, liver: 30, sugar: 90 },
        belly: 0, special: 0,
        equipment: { weapon: null, armor: null, accessory1: null, accessory2: null },
        skills: [], sp: 0,
      },
      currentMap: 'home', day: 1, timeSlot: 'morning', flags: {}, mode: 'map',
    },
    inventory: {}, quests: {}, relations: {},
    dex: { enemies: {}, items: {}, fish: {}, food: {} },
    achievements: [], titles: [], endings: [], foodLog: [], fishLog: {}, playtime: 0,
  }
  return { ...base, ...overrides }
}
