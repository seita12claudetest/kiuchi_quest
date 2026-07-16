import type { NPCDef } from '../types'

export const npcs: NPCDef[] = [
  { id: 'npc_doctor', name: '佐藤医師', sprite: { atlas: 'npcs', x: 0, y: 0, w: 32, h: 32 }, relationMax: 100, dialogs: [{ id: 'hello', text: '私は医師の佐藤医師。今日も無理せず行こう。' }, { id: 'advice', text: '体調と財布の両方を見ながら進むんだ。' }] },
  { id: 'npc_trainer', name: '豪田トレーナー', sprite: { atlas: 'npcs', x: 1, y: 0, w: 32, h: 32 }, relationMax: 100, dialogs: [{ id: 'hello', text: '私はトレーナーの豪田トレーナー。今日も無理せず行こう。' }, { id: 'advice', text: '体調と財布の両方を見ながら進むんだ。' }] },
  { id: 'npc_owner', name: '横丁の店主', sprite: { atlas: 'npcs', x: 2, y: 0, w: 32, h: 32 }, relationMax: 100, dialogs: [{ id: 'hello', text: '私は店主の横丁の店主。今日も無理せず行こう。' }, { id: 'advice', text: '体調と財布の両方を見ながら進むんだ。' }] },
  { id: 'npc_coworker', name: '田中同僚', sprite: { atlas: 'npcs', x: 3, y: 0, w: 32, h: 32 }, relationMax: 100, dialogs: [{ id: 'hello', text: '私は同僚の田中同僚。今日も無理せず行こう。' }, { id: 'advice', text: '体調と財布の両方を見ながら進むんだ。' }] },
  { id: 'npc_boss', name: '鬼塚上司', sprite: { atlas: 'npcs', x: 4, y: 0, w: 32, h: 32 }, relationMax: 100, dialogs: [{ id: 'hello', text: '私は上司の鬼塚上司。今日も無理せず行こう。' }, { id: 'advice', text: '体調と財布の両方を見ながら進むんだ。' }] },
  { id: 'npc_junior', name: '鈴木後輩', sprite: { atlas: 'npcs', x: 5, y: 0, w: 32, h: 32 }, relationMax: 100, dialogs: [{ id: 'hello', text: '私は後輩の鈴木後輩。今日も無理せず行こう。' }, { id: 'advice', text: '体調と財布の両方を見ながら進むんだ。' }] },
  { id: 'npc_bartender', name: 'ミカバーテンダー', sprite: { atlas: 'npcs', x: 6, y: 0, w: 32, h: 32 }, relationMax: 100, dialogs: [{ id: 'hello', text: '私はバーテンダーのミカバーテンダー。今日も無理せず行こう。' }, { id: 'advice', text: '体調と財布の両方を見ながら進むんだ。' }] },
  { id: 'npc_angler', name: '浜田釣り師', sprite: { atlas: 'npcs', x: 7, y: 0, w: 32, h: 32 }, relationMax: 100, dialogs: [{ id: 'hello', text: '私は釣り師の浜田釣り師。今日も無理せず行こう。' }, { id: 'advice', text: '体調と財布の両方を見ながら進むんだ。' }] },
  { id: 'npc_chef', name: '陳料理人', sprite: { atlas: 'npcs', x: 0, y: 1, w: 32, h: 32 }, relationMax: 100, dialogs: [{ id: 'hello', text: '私は料理人の陳料理人。今日も無理せず行こう。' }, { id: 'advice', text: '体調と財布の両方を見ながら進むんだ。' }] },
  { id: 'npc_nurse', name: '青木看護師', sprite: { atlas: 'npcs', x: 1, y: 1, w: 32, h: 32 }, relationMax: 100, dialogs: [{ id: 'hello', text: '私は看護師の青木看護師。今日も無理せず行こう。' }, { id: 'advice', text: '体調と財布の両方を見ながら進むんだ。' }] },
  { id: 'npc_mother', name: '木内母', sprite: { atlas: 'npcs', x: 2, y: 1, w: 32, h: 32 }, relationMax: 100, dialogs: [{ id: 'hello', text: '私は家族の木内母。今日も無理せず行こう。' }, { id: 'advice', text: '体調と財布の両方を見ながら進むんだ。' }] },
  { id: 'npc_rival', name: 'ライバル黒田', sprite: { atlas: 'npcs', x: 3, y: 1, w: 32, h: 32 }, relationMax: 100, dialogs: [{ id: 'hello', text: '私はライバルのライバル黒田。今日も無理せず行こう。' }, { id: 'advice', text: '体調と財布の両方を見ながら進むんだ。' }] },
  { id: 'npc_clerk', name: 'コンビニ店員', sprite: { atlas: 'npcs', x: 4, y: 1, w: 32, h: 32 }, relationMax: 100, dialogs: [{ id: 'hello', text: '私は店員のコンビニ店員。今日も無理せず行こう。' }, { id: 'advice', text: '体調と財布の両方を見ながら進むんだ。' }] },
  { id: 'npc_mayor', name: '横丁町内会長', sprite: { atlas: 'npcs', x: 5, y: 1, w: 32, h: 32 }, relationMax: 100, dialogs: [{ id: 'hello', text: '私は町内会長の横丁町内会長。今日も無理せず行こう。' }, { id: 'advice', text: '体調と財布の両方を見ながら進むんだ。' }] },
  { id: 'npc_fortune', name: '占い師ルナ', sprite: { atlas: 'npcs', x: 6, y: 1, w: 32, h: 32 }, relationMax: 100, dialogs: [{ id: 'hello', text: '私は占い師の占い師ルナ。今日も無理せず行こう。' }, { id: 'advice', text: '体調と財布の両方を見ながら進むんだ。' }] },
  { id: 'npc_guard', name: '警備員大原', sprite: { atlas: 'npcs', x: 7, y: 1, w: 32, h: 32 }, relationMax: 100, dialogs: [{ id: 'hello', text: '私は警備員の警備員大原。今日も無理せず行こう。' }, { id: 'advice', text: '体調と財布の両方を見ながら進むんだ。' }] }
]
