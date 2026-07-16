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
type Direction = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'

type GameState = {
  x: number
  y: number
  hp: number
  energy: number
  coins: number
  quests: number
  message: string
}

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector)
  if (!element) {
    throw new Error(`Required UI element is missing: ${selector}`)
  }
  return element
}

const canvas = requireElement<HTMLCanvasElement>('#game')
const hud = requireElement<HTMLDivElement>('#hud')
const panel = requireElement<HTMLElement>('#panel')
const modal = requireElement<HTMLDialogElement>('#modal')
const modalBody = requireElement<HTMLDivElement>('#modalBody')
const toast = requireElement<HTMLDivElement>('#toast')

const canvasContext = canvas.getContext('2d')
if (!canvasContext) {
  throw new Error('Canvas 2D context is unavailable')
}
const ctx: CanvasRenderingContext2D = canvasContext

const state: GameState = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  hp: 100,
  energy: 100,
  coins: 120,
  quests: 0,
  message: 'GitHub Pages 版を起動しました。矢印キーまたは画面ボタンで移動できます。'
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function drawGrid(): void {
  ctx.strokeStyle = '#123d25'
  ctx.lineWidth = 1
  for (let x = 0; x <= canvas.width; x += 40) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvas.height)
    ctx.stroke()
  }
  for (let y = 0; y <= canvas.height; y += 40) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width, y)
    ctx.stroke()
  }
}

function render(): void {
  ctx.fillStyle = '#06140c'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  drawGrid()

  ctx.fillStyle = '#ffd75e'
  ctx.fillRect(76, 72, 108, 62)
  ctx.fillStyle = '#6bb9ff'
  ctx.fillRect(520, 310, 120, 76)
  ctx.fillStyle = '#58ff83'
  ctx.beginPath()
  ctx.arc(state.x, state.y, 18, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 3
  ctx.stroke()

  ctx.fillStyle = '#b8ffc8'
  ctx.font = '18px "MS Gothic", monospace'
  ctx.fillText('昭和横丁', 88, 108)
  ctx.fillText('会社', 558, 355)

  hud.innerHTML = [
    `<span class="badge">HP ${state.hp}</span>`,
    `<span class="badge">体力 ${state.energy}</span>`,
    `<span class="badge">所持金 ${state.coins} 円</span>`,
    `<span class="badge">達成クエスト ${state.quests}</span>`
  ].join('')

  panel.innerHTML = `
    <section class="section">
      <h2>木内の大冒険 DELUXE</h2>
      <p>${state.message}</p>
      <div class="bar"><div class="fill" style="width: ${state.hp}%"></div></div>
      <div class="bar"><div class="fill special" style="width: ${state.energy}%"></div></div>
    </section>
    <section class="section">
      <h3>操作</h3>
      <p>矢印キー / 画面右下ボタン: 移動</p>
      <p>上部メニュー: クエスト、アイテム、セーブ、遊び方を表示</p>
    </section>
  `
}

function move(direction: Direction): void {
  const step = 22
  if (direction === 'ArrowUp') state.y -= step
  if (direction === 'ArrowDown') state.y += step
  if (direction === 'ArrowLeft') state.x -= step
  if (direction === 'ArrowRight') state.x += step
  state.x = clamp(state.x, 20, canvas.width - 20)
  state.y = clamp(state.y, 20, canvas.height - 20)
  state.energy = clamp(state.energy - 1, 0, 100)
  state.message = '木内は昭和横丁を探索中です。'
  render()
}

function showModal(title: string, body: string): void {
  modalBody.innerHTML = `<h2>${title}</h2>${body}`
  modal.showModal()
}

function showToast(message: string): void {
  toast.textContent = message
  toast.style.display = 'block'
  window.setTimeout(() => {
    toast.style.display = 'none'
  }, 2200)
}

document.addEventListener('keydown', (event) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault()
    move(event.key as Direction)
  }
})

document.querySelectorAll<HTMLButtonElement>('[data-move]').forEach((button) => {
  button.addEventListener('click', () => move(button.dataset.move as Direction))
})

document.querySelectorAll<HTMLButtonElement>('[data-menu]').forEach((button) => {
  button.addEventListener('click', () => {
    const menu = button.dataset.menu ?? 'menu'
    if (menu === 'save') {
      localStorage.setItem('kiuchi_quest_save', JSON.stringify(state))
      showToast('セーブしました')
      return
    }
    showModal(button.textContent ?? 'メニュー', `<p>${button.textContent} は Web 版で確認できます。</p>`)
  })
})

document.querySelector<HTMLButtonElement>('#helpButton')?.addEventListener('click', () => {
  showModal('遊び方', '<p>木内を動かして昭和横丁と会社を巡り、健康と所持金を管理しながらクエスト達成を目指します。</p>')
})

document.querySelector<HTMLButtonElement>('#endingButton')?.addEventListener('click', () => {
  state.quests += 1
  state.message = 'エンディング判定: まだ冒険は続きます。'
  render()
})

render()
