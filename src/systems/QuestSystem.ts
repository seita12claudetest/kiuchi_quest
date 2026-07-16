import type { QuestDef, QuestProgress, SaveData } from '@/types'

export type QuestAction = QuestDef['target']['type']

export class QuestSystem {
  startQuest(save: SaveData, questId: string): SaveData {
    const current = save.quests[questId] ?? this.emptyProgress()
    if (current.started) return save
    return { ...save, quests: { ...save.quests, [questId]: { ...current, started: true } } }
  }

  applyProgress(save: SaveData, quests: QuestDef[], action: QuestAction, targetId?: string, amount = 1): SaveData {
    let changed = false
    const nextQuests = { ...save.quests }
    for (const quest of quests) {
      const progress = nextQuests[quest.id]
      if (!progress?.started || progress.done || quest.target.type !== action) continue
      if (quest.target.targetId && quest.target.targetId !== targetId) continue
      changed = true
      const nextProgress = Math.min(quest.target.count, progress.progress + amount)
      nextQuests[quest.id] = { ...progress, progress: nextProgress, done: nextProgress >= quest.target.count }
    }
    return changed ? { ...save, quests: nextQuests } : save
  }

  claimReward(save: SaveData, questId: string): SaveData {
    const progress = save.quests[questId]
    if (!progress?.done || progress.claimed) return save
    return { ...save, quests: { ...save.quests, [questId]: { ...progress, claimed: true } } }
  }

  private emptyProgress(): QuestProgress {
    return { started: false, done: false, claimed: false, progress: 0 }
  }
}
