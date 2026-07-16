import { describe, it, expect } from 'vitest'
import { SkillSystem } from '@/systems/SkillSystem'
import type { SaveData, SkillDef } from '@/types'
import { baseSave } from './testUtils'

const skill = (overrides: Partial<SkillDef> = {}): SkillDef => ({ id: 's1', name: 'Skill', desc: '', tree: 'physical', cost: 2, prereqs: [], effect: {}, level: 1, ...overrides })

describe('SkillSystem', () => {
  it('learns a skill by spending SP', () => {
    const sys = new SkillSystem()
    const save = baseSave({ state: { ...baseSave().state, player: { ...baseSave().state.player, sp: 3 } } as SaveData['state'] })
    const result = sys.learn(save, skill())
    expect(result.state.player.skills).toContain('s1')
    expect(result.state.player.sp).toBe(1)
  })

  it('rejects learned skills, insufficient SP, and missing prereqs', () => {
    const sys = new SkillSystem()
    expect(sys.canLearn(baseSave({ state: { ...baseSave().state, player: { ...baseSave().state.player, sp: 1 } } as SaveData['state'] }), skill())).toBe(false)
    expect(sys.canLearn(baseSave({ state: { ...baseSave().state, player: { ...baseSave().state.player, sp: 5, skills: ['s1'] } } as SaveData['state'] }), skill())).toBe(false)
    expect(sys.canLearn(baseSave({ state: { ...baseSave().state, player: { ...baseSave().state.player, sp: 5 } } as SaveData['state'] }), skill({ prereqs: ['root'] }))).toBe(false)
  })
})
