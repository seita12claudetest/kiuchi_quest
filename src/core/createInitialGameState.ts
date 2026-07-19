import type { GameState } from '@/types'

export function createInitialGameState(): GameState {
  return {
    currentMap: 'office',
    day: 1,
    timeSlot: 'morning',
    flags: {},
    eventLog: ['1988年、AS/400導入。「紙の台帳が、画面の向こうへ引っ越していく……時代が動いてるな」'],
    relations: { boss: 5, colleague: 10, yokocho_master: 0 },
    questProgress: {
      first_assignment: { started: true, done: false, claimed: false, progress: 0 },
      office_friendship: { started: true, done: false, claimed: false, progress: 0 },
      healthy_routine: { started: true, done: false, claimed: false, progress: 0 },
    },
    workDays: 0,
    mode: 'title',
    career: {
      rank: 'new_hire', rankName: '新卒社員', performance: 0, trust: 5,
      expertise: 0, politics: 0, stress: 8, age: 22, year: 1988, calendarMonth: 4, monthsAtRank: 0,
    },
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
