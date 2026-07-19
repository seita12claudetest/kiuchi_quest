import { createInitialGameState } from '@/core/createInitialGameState'
import { GameEngine } from '@/core/GameEngine'
import { MapScene } from '@/scenes/MapScene'
import { TitleScene } from '@/scenes/TitleScene'
import { AudioManager } from '@/audio/AudioManager'
import { CareerSystem } from '@/systems/CareerSystem'
import { corporateHistoryEvents } from '@/data/corporateHistory'
import type { CareerState, TimeSlot } from '@/types'

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
const startButton = requireElement<HTMLButtonElement>('#startButton')

const state = createInitialGameState()
const audio = new AudioManager()
const careerSystem = new CareerSystem()
const mapScene = new MapScene(canvas.width, canvas.height)
const startGame = (): void => {
  startButton.hidden = true
  audio.play('confirm')
  engine.changeScene(mapScene)
}
const engine = new GameEngine(canvas, new TitleScene(startGame), state)
startButton.addEventListener('click', startGame)

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
  const career = state.career
  const actions = actionsFor(state.timeSlot)
  const latest = state.eventLog?.slice(-3).reverse() ?? []
  panel.innerHTML = `
    <section class="section">
      <h2>木内 一</h2>
      <p class="gold">${career?.year ?? 1988}年${career?.calendarMonth ?? 4}月 / ${career?.rankName ?? '新卒社員'} / ${career?.age ?? 22}歳</p>
      <p>現在地: ${mapName(state.currentMap)}　Day ${state.day} / ${slotName(state.timeSlot)}</p>
      <p>朝・昼は会社勤務。移動だけでは時間は進まず、仕事・食事・交流などの行動で進みます。</p>
    </section>
    <section class="section action-section">
      <h3>次の行動</h3>
      <div class="action-grid">${actions.map(action => `<button data-action="${action.id}">${action.label}</button>`).join('')}</div>
    </section>
    <section class="section">
      <h3>今日の記録</h3>
      ${latest.length ? latest.map(line => `<p class="log-line">${line}</p>`).join('') : '<p>初出社。まずは仕事を覚えよう。</p>'}
    </section>
    <section class="section">
      <h3>会社員ステータス</h3>
      <p>評価 ${career?.performance ?? 0} / 信頼 ${career?.trust ?? 0} / 専門性 ${career?.expertise ?? 0}</p>
      <p>社内調整 ${career?.politics ?? 0} / ストレス ${career?.stress ?? 0}</p>
    </section>
    <section class="section">
      <h3>健康ステータス</h3>
      <p>血圧 ${state.player.health.blood} / 尿酸 ${state.player.health.uric} / コレステロール ${state.player.health.chol}</p>
      <p>HP ${state.player.hp}/${state.player.maxHp} / 所持金 ${state.player.gold.toLocaleString()}円</p>
    </section>
  `
}

type LifeAction = { id: string; label: string }
const ACTIONS: Record<TimeSlot, LifeAction[]> = {
  morning: [{ id: 'focus', label: '📑 集中して働く' }, { id: 'teamwork', label: '🤝 先輩と仕事' }],
  noon: [{ id: 'lunch', label: '🍱 社食で昼食' }, { id: 'afternoon', label: '💻 午後の業務' }],
  evening: [{ id: 'social', label: '🍶 横丁で交流' }, { id: 'gym', label: '🏋️ ジムへ' }, { id: 'home', label: '🏠 帰宅する' }],
  night: [{ id: 'sleep', label: '🌙 就寝する' }],
}

function actionsFor(slot: TimeSlot): LifeAction[] { return ACTIONS[slot] }
function slotName(slot: TimeSlot): string { return { morning: '朝', noon: '昼', evening: '夕方', night: '夜' }[slot] }
function mapName(id: string): string { return { office: '東都商事 本社', yokocho: '昭和横丁', gym: '健康ジム', home: '木内の自宅' }[id] ?? id }

async function moveTo(mapId: string): Promise<void> {
  await mapScene.changeMap(mapId, state, 6, 6)
}

function addLog(message: string): void {
  state.eventLog = [...(state.eventLog ?? []), message].slice(-12)
  showToast(message)
}

function progressQuest(id: string, amount = 1): void {
  const progress = state.questProgress?.[id]
  if (!progress || progress.done) return
  progress.progress += amount
  const targets: Record<string, number> = { first_assignment: 5, office_friendship: 4, healthy_routine: 3 }
  if (progress.progress >= targets[id]) {
    progress.done = true
    state.player.gold += 500
    addLog(`クエスト達成「${questName(id)}」報酬500円`)
  }
}

function questName(id: string): string {
  return { first_assignment: '新人の初仕事', office_friendship: '根回しも仕事のうち', healthy_routine: '健康第一' }[id] ?? id
}

function applyWork(result: Parameters<CareerSystem['work']>[1], message: string): void {
  if (!state.career) return
  const oldRank = state.career.rank
  state.career = careerSystem.work(state.career, result)
  state.workDays = (state.workDays ?? 0) + 1
  progressQuest('first_assignment')
  addLog(message)
  if (state.workDays % 5 === 0) advanceCareerMonth()
  if (oldRank !== state.career.rank) announcePromotion(state.career)
}

function advanceCareerMonth(): void {
  if (!state.career) return
  const previousYear = state.career.year
  state.career = careerSystem.advanceMonth(state.career)
  if (state.career.year !== previousYear) {
    const event = corporateHistoryEvents.find(item => item.year === state.career?.year)
    if (event) {
      state.career = careerSystem.work(state.career, event.effect)
      addLog(`${event.title} ${event.line}`)
    }
  }
}

function announcePromotion(career: CareerState): void {
  audio.play('promotion')
  addLog(`昇進辞令：木内 一を「${career.rankName}」に任ずる！`)
}

async function performAction(action: string): Promise<void> {
  audio.play('confirm')
  if (state.timeSlot === 'morning' && action === 'focus') {
    applyWork({ performance: 4, expertise: 3, stress: 2 }, 'AS/400の伝票処理を覚えた。')
    state.timeSlot = 'noon'
  } else if (state.timeSlot === 'morning' && action === 'teamwork') {
    applyWork({ performance: 2, trust: 4, politics: 1, stress: 1 }, '先輩と照合作業。報連相の勘所を学んだ。')
    state.relations!.colleague += 2
    progressQuest('office_friendship')
    state.timeSlot = 'noon'
  } else if (state.timeSlot === 'noon' && action === 'lunch') {
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + 8)
    state.player.gold = Math.max(0, state.player.gold - 350)
    state.mealLog = [...(state.mealLog ?? []), '社食の日替わり定食']
    addLog('社食の日替わり定食。午後も頑張れそうだ。')
    state.timeSlot = 'evening'
  } else if (state.timeSlot === 'noon' && action === 'afternoon') {
    applyWork({ performance: 3, expertise: 2, trust: 1, stress: 3 }, '午後の稟議と集計を片付けた。')
    state.timeSlot = 'evening'
  } else if (state.timeSlot === 'evening' && action === 'social') {
    await moveTo('yokocho')
    state.relations!.yokocho_master += 3
    state.relations!.colleague += 1
    if (state.career) state.career = careerSystem.work(state.career, { trust: 2, politics: 3, stress: -3 })
    progressQuest('office_friendship')
    addLog('横丁で同僚の本音を聞いた。飲みすぎには注意。')
    state.timeSlot = 'night'
  } else if (state.timeSlot === 'evening' && action === 'gym') {
    await moveTo('gym')
    state.player.power += 1
    state.player.health.blood = Math.max(105, state.player.health.blood - 1)
    progressQuest('healthy_routine')
    addLog('軽く汗を流した。健康と仕事は長期戦だ。')
    state.timeSlot = 'night'
  } else if (state.timeSlot === 'evening' && action === 'home') {
    await moveTo('home')
    addLog('今日は定時で帰宅。ストレスが少し和らいだ。')
    if (state.career) state.career.stress = Math.max(0, state.career.stress - 2)
    state.timeSlot = 'night'
  } else if (state.timeSlot === 'night' && action === 'sleep') {
    state.day += 1
    state.timeSlot = 'morning'
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + 12)
    await moveTo('office')
    addLog(`Day ${state.day} 出社。朝礼が始まる。`)
  }
  updatePanel()
}

panel.addEventListener('click', event => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-action]')
  if (button?.dataset.action) void performAction(button.dataset.action)
})

document.querySelectorAll<HTMLButtonElement>('[data-move]').forEach((button) => {
  button.addEventListener('click', () => {
    audio.play('select')
    const key = button.dataset.move
    if (key) engine.handleInput(key)
    updatePanel()
  })
})

document.querySelectorAll<HTMLButtonElement>('[data-menu]').forEach((button) => {
  button.addEventListener('click', () => {
    audio.play('confirm')
    const menu = button.dataset.menu ?? 'menu'
    if (menu === 'save') {
      localStorage.setItem('kiuchi_quest_save', JSON.stringify(state))
      showToast('セーブしました')
      return
    }
    if (menu === 'quests') {
      const targets: Record<string, number> = { first_assignment: 5, office_friendship: 4, healthy_routine: 3 }
      showModal('クエスト', Object.entries(state.questProgress ?? {}).map(([id, progress]) => `<article><h3>${progress.done ? '✅' : '📌'} ${questName(id)}</h3><p>${progress.progress}/${targets[id]} ${progress.done ? '達成済み' : '進行中'}</p></article>`).join(''))
      return
    }
    if (menu === 'relations') {
      const names: Record<string, string> = { boss: '上司', colleague: '同僚', yokocho_master: '横丁の大将' }
      showModal('好感度', Object.entries(state.relations ?? {}).map(([id, value]) => `<p>${names[id] ?? id}：${value} / 100</p>`).join(''))
      return
    }
    showModal(button.textContent ?? 'メニュー', `<p>ゲームを進めると記録が追加されます。</p>`)
  })
})

document.querySelector<HTMLButtonElement>('#helpButton')?.addEventListener('click', () => {
  audio.play('confirm')
  showModal('遊び方', '<p>木内を動かして昭和横丁と会社を巡り、健康と所持金を管理しながらクエスト達成を目指します。</p>')
})

document.querySelector<HTMLButtonElement>('#endingButton')?.addEventListener('click', () => {
  audio.play('confirm')
  state.flags.endingChecked = true
  showModal('エンディング判定', '<p>まだ冒険は続きます。健康優良社員エンドを目指しましょう。</p>')
})

window.addEventListener('keydown', updatePanel)
updatePanel()
engine.start()
