import type { ItemDef } from '../types'

export const items: ItemDef[] = [
  { id: 'item_001', name: '絆創膏', desc: '絆創膏。冒険に役立つ品。', category: 'medicine', icon: '🩹', effect: { hp: 10 }, price: 50, stackable: true },
  { id: 'item_002', name: '胃薬', desc: '胃薬。冒険に役立つ品。', category: 'medicine', icon: '💊', effect: { hp: 15 }, price: 75, stackable: true },
  { id: 'item_003', name: '漢方薬', desc: '漢方薬。冒険に役立つ品。', category: 'medicine', icon: '🌿', effect: { hp: 20 }, price: 100, stackable: true },
  { id: 'item_004', name: 'ビタミン剤', desc: 'ビタミン剤。冒険に役立つ品。', category: 'medicine', icon: '💪', effect: { hp: 25 }, price: 125, stackable: true },
  { id: 'item_005', name: '湿布', desc: '湿布。冒険に役立つ品。', category: 'medicine', icon: '🧻', effect: { hp: 30 }, price: 150, stackable: true },
  { id: 'item_006', name: 'プロテイン粉', desc: 'プロテイン粉。冒険に役立つ品。', category: 'medicine', icon: '🥤', effect: { hp: 35 }, price: 175, stackable: true },
  { id: 'item_007', name: '万歩計', desc: '万歩計。冒険に役立つ品。', category: 'equipment', icon: '⌚', effect: { def: 1 }, price: 200, stackable: true },
  { id: 'item_008', name: '古いネクタイ', desc: '古いネクタイ。冒険に役立つ品。', category: 'equipment', icon: '👔', effect: { def: 2 }, price: 225, stackable: true },
  { id: 'item_009', name: '革靴', desc: '革靴。冒険に役立つ品。', category: 'equipment', icon: '👞', effect: { def: 3 }, price: 250, stackable: true },
  { id: 'item_010', name: '安全ヘルメット', desc: '安全ヘルメット。冒険に役立つ品。', category: 'equipment', icon: '⛑️', effect: { def: 4 }, price: 275, stackable: true },
  { id: 'item_011', name: '釣り餌', desc: '釣り餌。冒険に役立つ品。', category: 'material', icon: '🪱', effect: { special: 1 }, price: 300, stackable: true },
  { id: 'item_012', name: '丈夫な糸', desc: '丈夫な糸。冒険に役立つ品。', category: 'material', icon: '🧵', effect: { special: 1 }, price: 325, stackable: true },
  { id: 'item_013', name: '光る鱗', desc: '光る鱗。冒険に役立つ品。', category: 'material', icon: ' scales', effect: { special: 1 }, price: 350, stackable: true },
  { id: 'item_014', name: '横丁コイン', desc: '横丁コイン。冒険に役立つ品。', category: 'material', icon: '🪙', effect: { special: 1 }, price: 375, stackable: true },
  { id: 'item_015', name: '診察券', desc: '診察券。冒険に役立つ品。', category: 'key', icon: '🏥', effect: { special: 1 }, price: 400, stackable: false },
  { id: 'item_016', name: 'ジム会員証', desc: 'ジム会員証。冒険に役立つ品。', category: 'key', icon: '🏋️', effect: { special: 1 }, price: 425, stackable: false },
  { id: 'item_017', name: '社員証', desc: '社員証。冒険に役立つ品。', category: 'key', icon: '💳', effect: { special: 1 }, price: 450, stackable: false },
  { id: 'item_018', name: '名刺束', desc: '名刺束。冒険に役立つ品。', category: 'key', icon: '📇', effect: { special: 1 }, price: 475, stackable: false },
  { id: 'item_019', name: '包丁', desc: '包丁。冒険に役立つ品。', category: 'key', icon: '🔪', effect: { special: 1 }, price: 500, stackable: false },
  { id: 'item_020', name: '鍋', desc: '鍋。冒険に役立つ品。', category: 'key', icon: '🍲', effect: { special: 1 }, price: 525, stackable: false }
]
