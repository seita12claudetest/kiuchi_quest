import { GameEngine } from '@/core/GameEngine'
import { TitleScene } from '@/scenes/TitleScene'
import type { GameState } from '@/types'

const canvas = document.querySelector<HTMLCanvasElement>('#game')
if (!canvas) {
  throw new Error('Canvas element #game was not found')
}

const initialState: GameState = {
  player: {
    x: 300,
    y: 180,
    level: 1,
    xp: 0,
    nextXp: 10,
    hp: 30,
    maxHp: 30,
    power: 5,
    def: 3,
    gold: 0,
    health: {
      blood: 120,
      uric: 5,
      chol: 180,
      liver: 30,
      sugar: 90
    },
    belly: 100,
    special: 0,
    equipment: {
      weapon: null,
      armor: null,
      accessory1: null,
      accessory2: null
    },
    skills: [],
    sp: 0
  },
  currentMap: 'title',
  day: 1,
  timeSlot: 'morning',
  flags: {},
  mode: 'title'
}

let engine: GameEngine
engine = new GameEngine(canvas, new TitleScene(() => engine), initialState)
engine.start()
