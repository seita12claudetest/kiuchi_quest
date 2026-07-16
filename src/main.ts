import { createInitialGameState } from '@/core/createInitialGameState'
import { GameEngine } from '@/core/GameEngine'
import { MapScene } from '@/scenes/MapScene'
import { TitleScene } from '@/scenes/TitleScene'

const canvas = document.querySelector<HTMLCanvasElement>('#game')
if (!canvas) throw new Error('Canvas element #game was not found')

const state = createInitialGameState()
const engine = new GameEngine({ canvas, initialState: state })
const mapScene = new MapScene()
const titleScene = new TitleScene(() => engine.replaceScene(mapScene))

window.addEventListener('keydown', (event) => {
  engine.handleInput(event.key)
})

engine.pushScene(titleScene)
engine.start()
