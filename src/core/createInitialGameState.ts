import type { GameState } from '@/types'

export function createInitialGameState(): GameState {
  return {
    currentMap: 'yokocho',
    day: 1,
    timeSlot: 'evening',
    flags: {},
    mode: 'title',
    player: {
      x: 6,
      y: 6,
      level: 1,
      xp: 0,
      nextXp: 20,
      hp: 80,
      maxHp: 80,
      power: 8,
      def: 4,
      gold: 1200,
      health: { blood: 122, uric: 5.8, chol: 190, liver: 35, sugar: 92 },
      belly: 1,
      special: 0,
      equipment: { weapon: null, armor: null, accessory1: null, accessory2: null },
      skills: [],
      sp: 0,
    },
  }
}
