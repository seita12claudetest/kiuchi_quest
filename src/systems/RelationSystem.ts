import type { NPCDef, SaveData } from '@/types'

export class RelationSystem {
  getRelation(save: SaveData, npcId: string): number {
    return save.relations[npcId] ?? 0
  }

  setRelation(save: SaveData, npcId: string, value: number, npc?: NPCDef): SaveData {
    const max = npc?.relationMax ?? Number.POSITIVE_INFINITY
    const relation = Math.max(0, Math.min(max, value))
    return { ...save, relations: { ...save.relations, [npcId]: relation } }
  }

  addRelation(save: SaveData, npcId: string, delta: number, npc?: NPCDef): SaveData {
    return this.setRelation(save, npcId, this.getRelation(save, npcId) + delta, npc)
  }
}
