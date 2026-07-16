import { describe, it, expect } from 'vitest'
import { QuestSystem } from '@/systems/QuestSystem'
import type { QuestDef } from '@/types'
import { baseSave } from './testUtils'

const quest = (type: QuestDef['target']['type'], targetId = 'target', count = 2): QuestDef => ({ id: `${type}-q`, name: type, desc: '', target: { type, targetId, count }, reward: {} })

describe('QuestSystem', () => {
  it.each(['kill', 'collect', 'talk', 'visit', 'fish', 'cook', 'casino'] as const)('tracks %s quest progress', (type) => {
    const sys = new QuestSystem()
    const def = quest(type)
    const started = sys.startQuest(baseSave(), def.id)
    const once = sys.applyProgress(started, [def], type, 'target')
    expect(once.quests[def.id].progress).toBe(1)
    expect(once.quests[def.id].done).toBe(false)
    const done = sys.applyProgress(once, [def], type, 'target')
    expect(done.quests[def.id].done).toBe(true)
  })

  it('claims completed quests only once', () => {
    const sys = new QuestSystem()
    const save = baseSave({ quests: { q: { started: true, done: true, claimed: false, progress: 1 } } })
    expect(sys.claimReward(save, 'q').quests.q.claimed).toBe(true)
  })
})
