import type { EventDef } from '@/types'

export const facilityEvents: EventDef[] = [
  {
    id: 'home_facility',
    name: '自宅',
    type: 'facility',
    trigger: { type: 'tile', value: 'home' },
    repeatable: true,
    scenes: [
      {
        text: '自宅で何をしますか？',
        choices: [
          { label: '休息する', nextScene: 1 },
          { label: '料理する', nextScene: 2 },
          { label: 'セーブする', nextScene: 3 },
          { label: '食事ログを見る', nextScene: 4 },
        ],
      },
      { text: 'しっかり休んで体力を回復した。', effect: { rest: true, advanceTime: 1 } },
      { text: '健康的な家庭料理を作って食べた。', effect: { cook: { meal: '家庭料理', belly: 25 }, health: { blood: -2, chol: -3, sugar: -2 }, advanceTime: 1 } },
      { text: '現在の進行状況を記録した。', effect: { save: true, advanceTime: 1 } },
      { text: 'これまでの食事ログを確認した。', effect: { advanceTime: 1 } },
    ],
  },
  {
    id: 'hospital_treatment',
    name: '病院',
    type: 'facility',
    trigger: { type: 'tile', value: 'hospital' },
    repeatable: true,
    scenes: [
      { text: '病院で診察と治療を受け、健康指標が改善した。', effect: { hospital: true, advanceTime: 1 } },
    ],
  },
  {
    id: 'hospital_auto_danger',
    name: '緊急受診',
    type: 'health',
    trigger: { type: 'health', value: 'danger' },
    repeatable: true,
    scenes: [
      { text: '健康値が危険域に達したため、自動的に病院へ向かった。', effect: { hospital: true, advanceTime: 1, setFlags: { autoHospitalVisited: true } } },
    ],
  },
  {
    id: 'gym_training',
    name: 'ジム',
    type: 'facility',
    trigger: { type: 'tile', value: 'gym' },
    repeatable: true,
    scenes: [
      { text: 'ジムで汗を流し、健康指標が改善した。継続利用で力とスキルポイントを得られる。', effect: { gym: { rewardEvery: 2, power: 1, sp: 1 }, advanceTime: 1 } },
    ],
  },
]

export default facilityEvents
