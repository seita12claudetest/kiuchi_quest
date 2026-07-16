import type { EventDef } from '@/types'

export const events: EventDef[] = [
  {
    id: 'relation_mika_lunch',
    name: 'ミカとのランチ',
    type: 'relation',
    trigger: { type: 'talk', value: 'mika' },
    condition: { minRelation: { mika: 10 }, flags: { met_mika: true } },
    repeatable: false,
    scenes: [
      { speaker: 'ミカ', text: '今日は一緒にランチに行きませんか？' },
      { text: '楽しい昼食で距離が縮まった。', effect: { relation: { mika: 5 }, setFlags: { mika_lunch_done: true } } },
    ],
  },
  {
    id: 'health_check_warning',
    name: '健康診断の警告',
    type: 'health',
    trigger: { type: 'health', value: 'blood:150' },
    condition: { health: { blood: { min: 150 }, chol: { min: 220 } } },
    repeatable: false,
    scenes: [
      { speaker: '医師', text: '血圧とコレステロールが高めです。生活を見直しましょう。' },
      { text: '健康指導を受けた。', effect: { setFlags: { health_warning: true }, health: { blood: -5, chol: -10 } } },
    ],
  },
  {
    id: 'summer_festival',
    name: '夏祭り',
    type: 'season',
    trigger: { type: 'time', value: 'evening' },
    condition: { season: ['summer'], dayRange: [20, 30], weekday: ['sat', 'sun'] },
    repeatable: false,
    scenes: [
      { text: '屋台の明かりが商店街を照らしている。' },
      { text: '祭りの熱気で元気が出た。', effect: { hp: 10, gold: -100, items: [{ id: 'festival_charm', qty: 1 }] } },
    ],
  },
  {
    id: 'before_boss_encouragement',
    name: 'ボス前の激励',
    type: 'story',
    trigger: { type: 'tile', value: 'boss_gate' },
    condition: { minLevel: 5, flags: { boss_unlocked: true, boss_defeated: false } },
    repeatable: false,
    scenes: [
      { speaker: '相棒', text: 'この先が勝負だ。準備はいい？' },
      {
        text: '覚悟を決めた。',
        choices: [
          { label: '進む', nextScene: 2, effect: { setFlags: { boss_ready: true } } },
          { label: 'まだ準備する', nextScene: 2, effect: { hp: 5 } },
        ],
      },
      { text: '大きな扉が開いた。' },
    ],
  },
]

export default events
