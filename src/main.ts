import { createInitialGameState } from '@/core/createInitialGameState'
import { GameEngine } from '@/core/GameEngine'
import { MapScene } from '@/scenes/MapScene'
import { TitleScene } from '@/scenes/TitleScene'

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector)
  if (!element) throw new Error(`Required UI element is missing: ${selector}`)
  return element
}

const canvas = requireElement<HTMLCanvasElement>('#game')
const panel = requireElement<HTMLElement>('#panel')
const modal = requireElement<HTMLDialogElement>('#modal')
const modalBody = requireElement<HTMLDivElement>('#modalBody')
const toast = requireElement<HTMLDivElement>('#toast')

const state = createInitialGameState()
const engine = new GameEngine(canvas, new TitleScene(() => engine.changeScene(new MapScene(canvas.width, canvas.height))), state)

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

function updatePanel(): void {
  panel.innerHTML = `
    <section class="section">
      <h2>木内の大冒険 DELUXE</h2>
      <p>Enterで開始。方向キーまたは画面ボタンで昭和横丁を移動できます。</p>
      <p>現在地: ${state.currentMap} / ${state.player.x}, ${state.player.y}</p>
    </section>
    <section class="section">
      <h3>健康ステータス</h3>
      <p>血圧 ${state.player.health.blood} / 尿酸 ${state.player.health.uric} / コレステロール ${state.player.health.chol}</p>
      <p>HP ${state.player.hp}/${state.player.maxHp} / 所持金 ${state.player.gold}円</p>
    </section>
  `
}

document.querySelectorAll<HTMLButtonElement>('[data-move]').forEach((button) => {
  button.addEventListener('click', () => {
    const key = button.dataset.move
    if (key) engine.handleInput(key)
    updatePanel()
  })
})

document.querySelectorAll<HTMLButtonElement>('[data-menu]').forEach((button) => {
  button.addEventListener('click', () => {
    const menu = button.dataset.menu ?? 'menu'
    if (menu === 'save') {
      localStorage.setItem('kiuchi_quest_save', JSON.stringify(state))
      showToast('セーブしました')
      return
    }
    showModal(button.textContent ?? 'メニュー', `<p>${button.textContent} は Pages 版で表示確認できます。</p>`)
  })
})

document.querySelector<HTMLButtonElement>('#helpButton')?.addEventListener('click', () => {
  showModal('遊び方', '<p>木内を動かして昭和横丁と会社を巡り、健康と所持金を管理しながらクエスト達成を目指します。</p>')
})

document.querySelector<HTMLButtonElement>('#endingButton')?.addEventListener('click', () => {
  state.flags.endingChecked = true
  showModal('エンディング判定', '<p>まだ冒険は続きます。健康優良社員エンドを目指しましょう。</p>')
})

window.addEventListener('keydown', updatePanel)
updatePanel()
engine.start()
