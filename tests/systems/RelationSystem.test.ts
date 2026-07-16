import { describe, it, expect } from 'vitest'
import { RelationSystem } from '@/systems/RelationSystem'
import type { NPCDef } from '@/types'
import { baseSave } from './testUtils'

const npc: NPCDef = { id: 'n1', name: 'NPC', relationMax: 10, dialogs: [], sprite: { atlas: 'npc', x: 0, y: 0, w: 16, h: 16 } }

describe('RelationSystem', () => {
  it('gets, sets, adds, and clamps NPC relation', () => {
    const sys = new RelationSystem()
    const save = baseSave()
    expect(sys.getRelation(save, 'n1')).toBe(0)
    const added = sys.addRelation(save, 'n1', 12, npc)
    expect(added.relations.n1).toBe(10)
    const lowered = sys.addRelation(added, 'n1', -99, npc)
    expect(lowered.relations.n1).toBe(0)
  })
})
